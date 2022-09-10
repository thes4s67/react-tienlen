class Player {
  constructor(idx, id) {
    this.cards = [];
    this.idx = idx;
    this.id = id;
    // this.hand = [];
  }
  giveCard = (card) => {
    this.cards.push(card);
  };
  removeCards = (hand) => {
    let tempHand = hand.map((c) => c.card);
    this.cards = this.cards.filter((c) => !tempHand.includes(c));
  };
}

export default Player;
