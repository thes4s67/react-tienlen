import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import GamesList from "./game/gamesList.js";
import Game from "./game/game.js";
import { generateGameCode } from "./utils/index.js";

const app = express();
const gamesList = new GamesList();
app.use(cors({ origin: "http://localhost:3000" }));
const server = app.listen(process.env.PORT || 5001, () => {
  console.log(`Server started on ${process.env.PORT || 5001}`);
});
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

app.post("/api/register", (req, res) => {
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

io.on("connection", (socket) => {
  socket.on("createGame", (args) => {
    const game = new Game(args.host, args.code);
    game.addPlayer({ idx: 0, id: args.host, name: "SonnyPlayer1" });
    gamesList.addGame(game);
    console.log("game added", gamesList.games.length);
    // console.log(gamesList, "games");
  });
  socket.on("startGame", (args) => {});
});
