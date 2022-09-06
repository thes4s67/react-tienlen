/* Checks if hand played is valid */
export const isValidHand = (hand, gameInfo) => {
  let valid = false;
  //check if firstHand of game
  if (gameInfo.firstHand && gameInfo.lowestCard === hand[0]) {
    valid = true;
  }
};

const getHandType = (hand) => {
  const tempHand = hand.map((c) => Math.floor(c));
  const tempHandSum = tempHand.reduce((a, b) => a + b);
  //single
  if (tempHand.length === 1) return "Single";
  //pairs, trips, quads
  if (tempHandSum / tempHand.length === tempHand[0]) {
    if (tempHand.length === 2) return "Double";
    if (tempHand.length === 3) return "Triple";
    if (tempHand.length === 4) return "Quad";
  }
  if (tempHand.length > 2) {
    //check if single sequence
    if (isSingleSequence(tempHand)) return true;
    //check if pair sequence
    if (isPairSequence(tempHand)) return true;
  }
};

const isSingleSequence = (hand) => {
  for (let i = hand.length - 1; i > 0; i--) {
    if (hand[i] - hand[i - 1] !== 1) return false;
  }
  return true;
};

const isPairSequence = (hand) => {};

