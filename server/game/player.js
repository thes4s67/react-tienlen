class Player {
  constructor(idx, name, id) {
    this.hand = [];
    this.idx = idx;
    this.id = id;
    this.name = name;
  }
  giveCard = (card) => {
    this.hand.push(card);
  };
}

export default Player;
