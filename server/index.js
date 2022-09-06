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

app.post("/api/join", (req, res) => {
  res.send({
    playerId: new Date().getTime().toString(36).toUpperCase(),
  });
});

app.post("/api/games/:code", (req, res) => {
  const game = gamesList.findGame(req.params.code, req.body.playerId);
  res.send(game);
});

io.on("connection", (socket) => {
  // console.log(socket.id, "this the socket Id");
  socket.on("createGame", (args) => {
    const game = new Game(args.host, args.code);
    game.addPlayer({ idx: 0, id: args.host, name: "SonnyPlayer1" });
    gamesList.addGame(game);
    console.log(`Game ${args.code} started`, gamesList.games.length);
    socket.join(args.code);
    // console.log(gamesList, "games");
  });
  socket.on("joinGame", (args) => {
    console.log("player joined", args.code);
    socket.join(args.code);
  });
  socket.on("startGame", (args) => {});
  socket.on("sendMessage", (args) => {
    console.log(args, "we got a new message!");
    socket.to(args.code).emit("newMessage", {
      gameCode: args.code,
      playerId: args.playerId,
      message: args.message,
    });
  });
  socket.on("newMessage", (args) => {
    console.log(args, "we got the new message");
  });
});
