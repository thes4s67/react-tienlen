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
  findGame = (code, playerId) => {
    //TODO:
    for (let i = 0; i < this.games.length; i++) {
      const game = this.games[i];
      if (game.code === code.toUpperCase()) {
        return {
          exists: true,
          players: game.players.length,
          isHost: game.host === playerId,
          seated: game.host === playerId ? true : false,
          started: game.started,
          code,
        };
      }
    }
    return { exists: false };
  };
}

export default GamesList;
