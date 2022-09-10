class GamesList {
  constructor() {
    this.games = [];
  }
  addGame = (game) => {
    this.games.push(game);
  };
  endGame = (game) => {
    //TODO:
  };
  findGame = (code) => {
    for (let i = 0; i < this.games.length; i++) {
      const game = this.games[i];
      if (game.code === code.toUpperCase()) {
        return game;
      }
    }
    return null;
  };
  checkGame = (code, playerId) => {
    for (let i = 0; i < this.games.length; i++) {
      const game = this.games[i];
      if (game.code === code.toUpperCase()) {
        return {
          exists: true,
          players: game.gameInfo.players.length,
          isHost: game.host === playerId,
          seated: game.host === playerId ? true : false,
          seatingOrder: [],
          started: game.started,
          code,
          playersCards: [],
          prevHand: [],
        };
      }
    }
    return { exists: false };
  };
}

export default GamesList;
