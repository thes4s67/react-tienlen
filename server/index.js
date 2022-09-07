import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import GamesList from "./game/gamesList.js";
import Game from "./game/game.js";
import { generateGameCode } from "./utils/index.js";

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
    console.log(args, "player joined");
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
    game.start();
    //update to all players that game started
    io.in(args.code).emit("updateGameInfo", {
      started: true,
      playersCards: game.gameInfo.players.map((c) => c.cards.length),
      seatingOrder: game.gameInfo.seatingOrder,
    });
    //give each player their cards
    for (let i = 0; i < game.gameInfo.players.length; i++) {
      const player = game.gameInfo.players[i];
      io.to(player.id).emit("updatePlayerInfo", {
        cards: player.cards.map((c) => {
          return { card: c, active: false };
        }),
        idx: player.idx,
      });
    }
  });
  socket.on("playCard", (args) => {
    console.log(args);
    //Check if hand is playable
    //update gameInfo
    io.in(args.code).emit("updateGameInfo", {
      prevHand: args.cards,
    });
    //update playersHand
    const game = gamesList.findGame(args.code);
    const player = game.gameInfo.players.filter((c) => c.id === socketId)[0];
    player.removeCards(args.cards);
    console.log(player, player.id, "this id");
    io.to(player.id).emit("updatePlayerInfo", {
      cards: player.cards.map((c) => {
        return { card: c, active: false };
      }),
    });
  });
  socket.on("sendMessage", (args) => {
    console.log(args, "we got a new message!");
    io.in(args.code).emit("newMessage", {
      gameCode: args.code,
      playerId: args.playerId,
      message: args.message,
    });
  });
  socket.on("newMessage", (args) => {
    console.log(args, "we got the new message");
  });
});
