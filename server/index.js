import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import GamesList from "./game/gamesList.js";
import Game from "./game/game.js";
import { generateGameCode } from "./utils/index.js";
import {
  isValidFirstHand,
  checkSum,
  getHandType,
  getPlayersCards,
  getTableOrder,
} from "./game/gameLogic.js";

const app = express();
app.use(express.json());
const gamesList = new GamesList();
app.use(cors({ origin: "http://localhost:3000" }));
const server = app.listen(process.env.PORT || 5001, () => {
  console.log(`Server started on ${process.env.PORT || 5001}`);
});
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

app.post("/api/host", (req, res) => {
  res.send({
    playerId: new Date().getTime().toString(36).toUpperCase(),
    code: generateGameCode(),
  });
});

// app.post("/api/join", (req, res) => {
//   res.send({
//     playerId: new Date().getTime().toString(36).toUpperCase(),
//   });
// });

// app.post("/api/games/:code", (req, res) => {
//   const game = gamesList.checkGame(req.params.code, req.body.playerId);
//   res.send(game);
// });

io.on("connection", (socket) => {
  const socketId = socket.id;
  console.log(socketId, "initial connection");
  socket.io = io;
  socket.on("createGame", (args) => {
    const game = new Game(socketId, args.code);
    game.addPlayer({ idx: 0, id: socketId });
    gamesList.addGame(game);
    console.log(`Game ${args.code} started`, gamesList.games.length);
    socket.join(args.code);
    // console.log(gamesList, "games");
  });
  socket.on("getInitGameInfo", (args) => {
    console.log("getting game info for...", socketId);
    const game = gamesList.checkGame(args.code, socketId);
    io.to(socketId).emit("initGameInfo", game);
  });
  socket.on("joinGame", (args) => {
    socket.join(args.code);
    const game = gamesList.findGame(args.code);
    const players = game.gameInfo.players.length;
    game.addPlayer({ idx: players, id: socketId });
    io.to(socketId).emit("updatePlayerInfo", { seated: true });
    io.in(args.code).emit("updateGameInfo", {
      players: players + 1,
    });
  });
  socket.on("startGame", (args) => {
    const game = gamesList.findGame(args.code);
    if (game.gameInfo.winners.length === game.gameInfo.players.length - 1) {
      //reset game for new game
      console.log("game is reset!");
      game.reset();
    }
    game.start();
    //update to all players that game started
    io.in(args.code).emit("updateGameInfo", {
      started: true,
      seatingOrder: game.gameInfo.seatingOrder,
      playerTurn: game.gameInfo.playerTurn,
      firstHand: game.gameInfo.firstHand,
      winners: game.gameInfo.winners,
      prevHand: game.gameInfo.prevHand,
      gameEnd: false,
    });
    //give each player their cards
    for (let i = 0; i < game.gameInfo.players.length; i++) {
      const player = game.gameInfo.players[i];
      io.to(player.id).emit("updatePlayerInfo", {
        cards: player.cards.map((c) => {
          return { card: c, active: false };
        }),
        idx: player.idx,
        tableOrder: getTableOrder(player.idx, game.gameInfo.seatingOrder),
        playersCards: getPlayersCards(
          args.idx,
          game.gameInfo.seatingOrder,
          game.gameInfo.playersCards
        ),
      });
    }
  });
  socket.on("pass", (args) => {
    const game = gamesList.findGame(args.code);
    const currIdx = game.gameInfo.seatingOrder.indexOf(args.idx);
    io.in(args.code).emit("updateGameInfo", {
      playerTurn:
        currIdx === game.gameInfo.seatingOrder.length - 1
          ? game.gameInfo.seatingOrder[0]
          : game.gameInfo.seatingOrder[currIdx + 1],
    });
  });
  socket.on("playCard", (args) => {
    const game = gamesList.findGame(args.code);
    let valid = false;
    const hand = args.cards;
    //Check if hand is playable
    if (!game.gameInfo.firstHand) {
      console.log("not a first hand");
      //check if its a "free hand", all players passed last hand
      if (game.gameInfo.prevHandPlayer === args.idx) {
        console.log("this is a free hand");
        valid = getHandType(hand) !== "null";
      } else {
        const prevHand = game.gameInfo.prevHand;
        if (getHandType(hand) == getHandType(prevHand)) {
          console.log("we checked if hand is equal");
          valid = hand.length === prevHand.length && checkSum(hand, prevHand);
        } else {
          //check if bomb
          console.log("checking.. if bomb");
          const handType = getHandType(hand);
          if (
            (handType === "PairSquence" || handType === "Quad") &&
            Math.floor(prevHand[0].card) === 15
          ) {
            const handLen = handType === "Quad" ? 4 : hand.length / 2;
            if (prevHand.length === 1) {
              console.log("last hand had one 2");
              valid = handLen >= 3 ? true : false;
            }
            if (prevHand.length === 2) {
              console.log("last hand had dbl 2");
              valid = handLen > 3 && handType !== "Quad";
            }
          }
        }
      }
    } else {
      //its the first hand
      console.log("its the first hand");
      console.log(isValidFirstHand(hand, game.gameInfo), "isValidFirstHand");
      valid = isValidFirstHand(hand, game.gameInfo);
    }

    if (valid) {
      //if everything is correct
      game.gameInfo.prevHand = hand;
      game.gameInfo.prevHandPlayer = args.idx;
      game.gameInfo.firstHand = false;
      const currIdx = game.gameInfo.seatingOrder.indexOf(args.idx);
      // console.log(game.gameInfo.playersCards[args.idx] - args.cards.length);
      game.gameInfo.playersCards[args.idx] =
        game.gameInfo.playersCards[args.idx] - args.cards.length;
      //update gameInfo
      io.in(args.code).emit("updateGameInfo", {
        prevHand: args.cards,
        firstHand: false,
        playerTurn:
          currIdx === game.gameInfo.seatingOrder.length - 1
            ? game.gameInfo.seatingOrder[0]
            : game.gameInfo.seatingOrder[currIdx + 1],
      });
      //update playersHand
      const player = game.gameInfo.players.filter((c) => c.id === socketId)[0];
      player.removeCards(args.cards);

      for (let i = 0; i < game.gameInfo.players.length; i++) {
        const player = game.gameInfo.players[i];
        io.to(player.id).emit("updatePlayerInfo", {
          cards: player.cards.map((c) => {
            return { card: c, active: false };
          }),
          playersCards: getPlayersCards(
            args.idx,
            game.gameInfo.seatingOrder,
            game.gameInfo.playersCards
          ),
        });
      }

      if (player.cards.length === 0) {
        game.addWinner(args.idx);
        io.to(args.code).emit("updateGameInfo", {
          winners: game.gameInfo.winners,
          gameEnd:
            game.gameInfo.winners.length === game.gameInfo.players.length - 1,
        });
      }
    } else {
      //This is not a valid hand
      io.to(socketId).emit("updatePlayerInfo", {
        badPlay: true,
      });
    }
  });
  socket.on("sendMessage", (args) => {
    console.log(args, "we got a new message!");
    io.in(args.code).emit("newMessage", {
      gameCode: args.code,
      idx: args.idx,
      message: args.message,
    });
  });
});
