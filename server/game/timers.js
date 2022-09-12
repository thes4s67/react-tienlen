import { delay } from "../utils/index.js";
class Timers {
  constructor() {
    this.games = {};
  }
  addTimer = (code) => {
    const controller = new AbortController();
    this.games[code] = { code, controller, started: false };
  };
  start = async (code, io) => {
    this.games[code] = { ...this.games[code], started: true };
    for (let i = 40; i >= 0; i--) {
      if (this.games[code].controller.signal.aborted) {
        console.log(`timer for ${code} stopped!`);
        this.games[code] = { ...this.games[code], started: false };
        const controller = new AbortController();
        this.games[code].controller = controller;
        break;
      }
      await delay();
      io.in(code).emit("updateTimer", { time: i });
    }
  };
  stop = (code) => {
    this.games[code] = { ...this.games[code], started: false };
    this.games[code].controller.abort();
  };
}

export default Timers;
