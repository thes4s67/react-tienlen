class Deck {
  constructor(cards) {
    this.stack = cards;
    this.remaining = cards.length;
  }
  shuffle = () => {
    for (let i = this.stack.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = this.stack[i];
      this.stack[i] = this.stack[j];
      this.stack[j] = temp;
    }
  };
  deal = () => {
    this.remaining -= 1;
    //simulates dealing card from the top of the deck
    return this.stack.shift();
  };
}
export default Deck;
