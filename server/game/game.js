import { cards } from "./cards.js";
import Deck from "./deck.js";
import Player from "./player.js";

class Game {
  constructor(host, code) {
    this.host = host;
    this.code = code;
    this.started = false;
    this.gameInfo = {
      lowestCard: null,
      deck: null,
      players: [],
      playerTurn: null,
      firstHand: true,
      prevHand: [],
      //current player hand contains 2
      tempHandTwo: false,
    };
  }
  addPlayer = (p) => {
    if (this.gameInfo.players.length < 4) {
      this.gameInfo.players.push(new Player(p.idx, p.name, p.id));
    }
  };
  setPlayerTurn = (idx) => {
    //set whose turn it is
    this.gameInfo.playerTurn = idx;
  };
  sort = (hand) => {
    return hand.sort((a, b) => a - b);
  };
  start = () => {
    //check how many players
    if (this.gameInfo.players.length > 1) {
      const deck = new Deck(cards);
      //randomize the deck
      deck.shuffle();
      // //create players for game
      // for (let i = 0; i < this.init.length; i++) {
      //   this.gameInfo.players.push(new Player(this.init[i].idx, this.init[i].name));
      // }

      let pIdx = 0;
      let min = 20;
      //deal 1 card to each player at a time until each player has 13 cards
      for (let i = 0; i < this.gameInfo.players.length * 13; i++) {
        const card = deck.deal();
        this.gameInfo.players[pIdx].giveCard(card);
        //we find out who starts first
        if (card < min) this.setPlayerTurn(pIdx);
        min = Math.min(min, card);
        if (pIdx === this.gameInfo.players.length - 1) {
          pIdx = 0;
        } else {
          pIdx++;
        }
      }
      //sort each players deck
      for (let i = 0; i < this.gameInfo.players.length; i++) {
        let playerCards = this.gameInfo.players[i].cards;
        this.gameInfo.players[i].cards = this.sort(playerCards);
      }
      this.gameInfo.deck = deck;
      this.gameInfo.lowestCard = min;
      this.started = true;
      return {
        code: this.code,
        host: this.host,
        gameInfo: this.gameInfo,
      };
    } else {
      throw new Error("Need at least 2 players to start");
    }
  };
}

export default Game;
