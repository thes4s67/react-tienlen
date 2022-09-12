export const generateGameCode = () => {
  return Math.random().toString(36).toUpperCase().slice(2).slice(0, 5);
};

export const delay = () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const updateTimer = async (io, socket, game) => {
  for (let i = 40; i >= 0; i--) {
    await delay();
    io.in(game.code).emit("updateTimer", { time: i });
  }
  // console.log(game.code, game.gameInfo.playerTurn);
  // socket.emit("pass", { code: game.code, idx: game.gameInfo.playerTurn });
  // console.log("it got here...");
};
