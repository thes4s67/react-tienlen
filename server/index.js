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
  getTableOrder,
  getPlayerTurn,
} from "./game/gameLogic.js";
import dotenv from "dotenv";
import Timers from "./game/timers.js";

dotenv.config();
const app = express();
app.use(express.json());
const gamesList = new GamesList();
const timers = new Timers();

app.use(cors({ origin: process.env.CLIENT_URL }));
const server = app.listen(process.env.PORT || 5001, () => {
  console.log(`Server started on ${process.env.PORT || 5001}`);
});
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

app.get("/", (req, res) => {
  res.redirect("https://react-tienlen.vercel.app");
});

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
    timers.addTimer(args.code);
    game.addPlayer({ idx: 0, id: socketId });
    gamesList.addGame(game);
    console.log(
      `Game ${args.code} started - Total Games: ${gamesList.games.length}`
    );
    socket.join(args.code);
    // console.log(gamesList, "games");
  });
  socket.on("getInitGameInfo", (args) => {
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
      console.log(`Game ${args.code} reset...`);
      game.reset();
    }
    game.start();
    console.log(`Game ${args.code} started...`);
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
        playersCards: game.gameInfo.playersCards,
      });
    }
  });
  socket.on("pass", async (args) => {
    console.log(args, "passed");
    const game = gamesList.findGame(args.code);
    //confirm its the actual players turn
    if (args.idx === game.gameInfo.playerTurn) {
      const playerTurn = getPlayerTurn(args.idx, game.gameInfo);
      game.gameInfo.playerTurn = playerTurn;
      io.in(args.code).emit("updateGameInfo", {
        playerTurn,
      });
      //we count the number of passes to determine if there should be a freeHand
      game.gameInfo.passCount += 1;
      if (game.gameInfo.passCount === game.gameInfo.players.length) {
        game.gameInfo.freeHand = true;
        game.gameInfo.passCount = 0;
      }
    }
    // game.gameInfo.prevHandPlayer = args.idx;
  });
  socket.on("playCard", async (args) => {
    const game = gamesList.findGame(args.code);
    // if (timers.games[args.code].started) timers.stop(args.code);
    let valid = false;
    const hand = args.cards;
    //Check if hand is valid
    if (!game.gameInfo.firstHand) {
      //not first hand
      if (game.gameInfo.prevHandPlayer === args.idx || game.gameInfo.freeHand) {
        //"free hand", all players passed last hand
        valid = getHandType(hand) !== null;
      } else {
        const prevHand = game.gameInfo.prevHand;
        if (getHandType(hand) == getHandType(prevHand)) {
          valid = hand.length === prevHand.length && checkSum(hand, prevHand);
        } else {
          //check if bomb
          const handType = getHandType(hand);
          if (
            (handType === "PairSquence" || handType === "Quad") &&
            Math.floor(prevHand[0].card) === 15
          ) {
            const handLen = handType === "Quad" ? 4 : hand.length / 2;
            if (prevHand.length === 1) {
              valid = handLen >= 3 ? true : false;
            }
            if (prevHand.length === 2) {
              valid = handLen > 3 && handType !== "Quad";
            }
          }
        }
      }
    } else {
      //its the first hand
      valid = isValidFirstHand(hand, game.gameInfo);
    }

    //if hand is valid & its the players turn
    if (valid && args.idx === game.gameInfo.playerTurn) {
      game.gameInfo.prevHand = hand;
      game.gameInfo.prevHandPlayer = args.idx;
      game.gameInfo.firstHand = false;
      game.gameInfo.playersCards[args.idx] =
        game.gameInfo.playersCards[args.idx] - args.cards.length;
      const playerTurn = getPlayerTurn(args.idx, game.gameInfo);
      game.gameInfo.playerTurn = playerTurn;
      if (game.gameInfo.freeHand) {
        game.gameInfo.freeHand = false;
        game.gameInfo.passCount = 0;
      }
      //update gameInfo
      io.in(args.code).emit("updateGameInfo", {
        prevHand: args.cards,
        prevHandPlayer: args.idx,
        firstHand: false,
        playerTurn,
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
          playersCards: game.gameInfo.playersCards,
        });
      }

      if (player.cards.length === 0) {
        game.addWinner(args.idx);
        io.in(args.code).emit("updateGameInfo", {
          winners: game.gameInfo.winners,
          gameEnd:
            game.gameInfo.winners.length === game.gameInfo.players.length - 1,
        });
      }
      // console.log(game.gameInfo, "this is after valid hand");
      //start timer
      // timers.start(args.code, io);
    } else {
      //This is not a valid hand
      // console.log(
      //   valid,
      //   "should not be valid",
      //   args.idx,
      //   game.gameInfo.playerTurn
      // );
      if (!valid && args.idx === game.gameInfo.playerTurn) {
        io.to(socketId).emit("updatePlayerInfo", {
          msg: "Invalid hand! Play another hand.",
        });
      } else if (valid && args.idx !== game.gameInfo.playerTurn) {
        io.to(socketId).emit("updatePlayerInfo", {
          msg: "It is not your turn.",
        });
      }
    }
  });
  socket.on("sendMessage", (args) => {
    io.in(args.code).emit("newMessage", {
      gameCode: args.code,
      idx: args.idx,
      message: args.message,
    });
  });
  socket.on("disconnect", (args) => {
    //check if this is a player in a game
    const res = gamesList.findPlayerGame(socketId);
    //player exists in a game -- remove player from game
    if (res !== null && res.game.started) {
      console.log(socketId, "disconnected and game found");
      const { game, idx, id } = res;
      //remove player: update seating order, players in game, playerTurn, playersCards
      game.removePlayer(idx);
      if (game.gameInfo.players.length > 1) {
        //update gameInfo
        io.in(game.code).emit("updateGameInfo", {
          seatingOrder: game.gameInfo.seatingOrder,
          players: game.gameInfo.players.length,
          playerTurn: game.gameInfo.playerTurn,
          playersCards: game.gameInfo.playersCards,
        });
        //update each player
        for (let i = 0; i < game.gameInfo.players.length; i++) {
          const player = game.gameInfo.players[i];
          io.to(player.id).emit("updatePlayerInfo", {
            tableOrder: getTableOrder(player.idx, game.gameInfo.seatingOrder),
            msg: `Player ${idx + 1} has left`,
          });
        }
      }
      //if playersLeft = 1: end game, update winner
      if (game.gameInfo.players.length === 1) {
        console.log("there is only 1 player left");
        game.addWinner(game.gameInfo.players[0].idx);
        io.in(game.code).emit("updateGameInfo", {
          // seatingOrder: game.gameInfo.seatingOrder,
          // tableOrder: getTableOrder(player.idx, game.gameInfo.seatingOrder),
          players: game.gameInfo.players.length,
          winners: game.gameInfo.winners,
          gameEnd: true,
        });
      }
    }
  });
});
