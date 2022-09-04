class Player {
  constructor(idx, name) {
    this.hand = [];
    this.idx = idx;
    this.name = name;
  }
  giveCard = (card) => {
    this.hand.push(card);
  };
}

export default Player;
