class Player {
  constructor(idx, name, id) {
    this.cards = [];
    this.idx = idx;
    this.id = id;
    this.name = name;
    this.hand = [];
  }
  giveCard = (card) => {
    this.cards.push(card);
  };
}

export default Player;
