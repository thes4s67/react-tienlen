import { cards } from "./cards.js";
import Deck from "./deck.js";
import Player from "./player.js";

class Game {
  constructor() {
    this.players = [];
    this.playerTurn = null;
    this.gameInfo = {
      lastHandSum: null,
      lastHandLen: null,
      //the greatest suit
      lastHandSuit: null,
      //if last hand contained 2s
      lastHandTwo: false,
      //current player hand contains 2
      tempHandTwo: false,
    };
  }
  addPlayer = (p) => {
    if (this.players.length < 4) {
      this.players.push(new Player(p.idx, p.name));
    }
  };
  isGreaterHand = (sum, suit, len) => {
    let isGreater = false;
    const gameInfo = this.gameInfo;
    //if same cards are played but different suits
    if (Math.floor(sum) === Math.floor(this.lastHandSum))
      isGreater = suit > this.lastHandSuit ? true : false;
    if (sum > this.lastHandSuit) isGreater = true;
    if (isGreater) {
      //this hand beats prev hand
      this.lastHandSum = sum;
      this.lastHandLen = len;
      this.lastHandSuit = suit;
    }
    return isGreater;
  };
  isValidPlay = (hand) => {
    //if players # of cards != last players hand
    if (hand.length !== this.lastHandLen) return false;
  };
  isBomb = () => {};
  setPlayerTurn = (idx) => {
    //set whose turn it is
    this.playerTurn = idx;
  };
  sort = (hand) => {
    return hand.sort((a, b) => a - b);
  };
  start = () => {
    //check how many players
    if (this.players.length > 1) {
      const deck = new Deck(cards);
      //randomize the deck
      deck.shuffle();
      // //create players for game
      // for (let i = 0; i < this.init.length; i++) {
      //   this.players.push(new Player(this.init[i].idx, this.init[i].name));
      // }

      let pIdx = 0;
      let min = 20;
      //deal 1 card to each player at a time until each player has 13 cards
      for (let i = 0; i < this.players.length * 13; i++) {
        const card = deck.deal();
        this.players[pIdx].giveCard(card);
        //we find out who starts first
        if (card < min) this.setPlayerTurn(pIdx);
        min = Math.min(min, card);
        if (pIdx === this.players.length - 1) {
          pIdx = 0;
        } else {
          pIdx++;
        }
      }
      //sort each players deck
      for (let i = 0; i < this.players.length; i++) {
        let hand = this.players[i].hand;
        this.players[i].hand = this.sort(hand);
      }
    } else {
      throw new Error("Need at least 2 players to start");
    }
  };
}

export default Game;
