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
  findPlayerGame = (id) => {
    for (let i = 0; i < this.games.length; i++) {
      const game = this.games[i];
      for (let j = 0; j < game.gameInfo.players.length; j++) {
        const player = game.gameInfo.players[j];
        if (player.id === id) return { game, idx: player.idx, id: player.id };
      }
    }
    return null;
  };
  findGame = (code) => {
    for (let i = 0; i < this.games.length; i++) {
      const game = this.games[i];
      // console.log(game, "this is a game");
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
