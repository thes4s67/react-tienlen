import { cards } from "./cards.js";
import Deck from "./deck.js";
import Player from "./player.js";

class Game {
  constructor(id, code) {
    this.host = id;
    this.code = code;
    this.started = false;
    this.gameInfo = {
      lowestCard: null,
      deck: null,
      players: [],
      playerTurn: null,
      firstHand: true,
      prevHand: [],
      prevHandPlayer: null,
      seatingOrder: [],
      playersCards: [],
      winners: [],
    };
  }
  reset = () => {
    this.gameInfo = {
      ...this.gameInfo,
      lowestCard: null,
      deck: null,
      playerTurn: null,
      firstHand: true,
      prevHand: [],
      prevHandPlayer: null,
      //this tracks the remaining cards left for each player
      playersCards: {},
      winners: [],
    };
  };
  addPlayer = (p) => {
    if (this.gameInfo.players.length < 4) {
      this.gameInfo.players.push(new Player(p.idx, p.id));
    }
  };
  addWinner = (idx) => {
    this.gameInfo.winners.push(idx);
  };
  setPlayerTurn = (idx) => {
    //set whose turn it is
    this.gameInfo.playerTurn = idx;
  };
  randomize = () => {
    for (let i = this.gameInfo.seatingOrder.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = this.gameInfo.seatingOrder[i];
      this.gameInfo.seatingOrder[i] = this.gameInfo.seatingOrder[j];
      this.gameInfo.seatingOrder[j] = temp;
    }
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
        const player = this.gameInfo.players[i];
        let playerCards = player.cards;
        //add each player to seating arrangement
        this.gameInfo.seatingOrder.push(player.idx);
        player.cards = this.sort(playerCards);
        this.gameInfo.playersCards[player.idx] = 13;
      }
      this.gameInfo.deck = deck;
      this.gameInfo.lowestCard = min;
      //randomize the seating order
      this.randomize();
      this.started = true;
      return {
        code: this.code,
        host: this.host,
        started: this.started,
        gameInfo: this.gameInfo,
      };
    } else {
      throw new Error("Need at least 2 players to start");
    }
  };
}

export default Game;
