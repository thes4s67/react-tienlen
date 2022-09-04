import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
const server = app.listen(process.env.PORT || 5001, () => {
  console.log(`Server started on ${process.env.PORT || 5001}`);
});
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

io.on("connection", (socket) => {
  socket.on("createGame", (args) => {});
});
