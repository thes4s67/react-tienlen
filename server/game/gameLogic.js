/* Checks if hand played is valid */
export const isValidHand = (hand, gameInfo) => {
  //check if firstHand of game
  console.log(
    hand,
    gameInfo.firstHand,
    gameInfo.lowestCard,
    gameInfo.prevHand,
    "we are checking if Its Valid"
  );
  if (
    gameInfo.firstHand &&
    gameInfo.lowestCard === hand[0].card &&
    getHandType(hand) !== null
  ) {
    return true;
  }

  return false;
};

export const checkSum = (hand, prev) => {
  const tempHand = hand.map((c) => {
    return Math.floor(c.card);
  });
  const tempHandSum = tempHand.reduce((a, b) => a + b);
  const prevHand = prev.map((c) => {
    return Math.floor(c.card);
  });
  const prevHandSum = prevHand.reduce((a, b) => a + b);
  console.log(tempHandSum, prevHandSum, "this is the sum checking");
  //in case of same cards played, check for higher suit
  if (tempHandSum === prevHandSum) {
    const handLastSuit = hand[hand.length - 1].split(".")[1];
    const prevLastSuit = prev[prev.length - 1].split(".")[1];
    console.log(handLastSuit, prevLastSuit, "same cards check suit");
    return Number(handLastSuit) > Number(prevLastSuit);
  }
  return tempHandSum > prevHandSum;
};

export const getHandType = (hand) => {
  const tempHand = hand.map((c) => {
    return Math.floor(c.card);
  });
  console.log(tempHand, "after reduced");
  const tempHandSum = tempHand.reduce((a, b) => a + b);
  //single
  if (tempHand.length === 1) return "Single";
  if (tempHand.length > 2) {
    //pairs, trips, quads
    console.log("checking if pairs, trips, or quads");
    if (tempHandSum / tempHand.length === tempHand[0]) {
      if (tempHand.length === 2) return "Double";
      if (tempHand.length === 3) return "Triple";
      if (tempHand.length === 4) return "Quad";
    }
    //check if single sequence
    if (isSingleSequence(tempHand)) return "Sequence";
    //check if pair sequence
    if (isPairSequence(tempHand)) return "PairSquence";
  }
  console.log("it actually gets to here");
  return null;
};

const isSingleSequence = (tempHand) => {
  return tempHand.every(
    (num, i) =>
      i === tempHand.length - 1 ||
      (num < tempHand[i + 1] && tempHand[i + 1] !== 15)
  );
};

const isPairSequence = (tempHand) => {
  if (tempHand[tempHand.length - 1] === 15) return false;
  let counter = 0;
  let ret = tempHand.reduce((acc, curr) => {
    if (counter === 0) {
      acc.push(curr);
      counter++;
    } else {
      acc[acc.length - 1] += curr;
      counter = 0;
    }
    return acc;
  }, []);
  for (let i = 0; i < ret.length - 1; i++) {
    if (ret[i + 1] - ret[i] !== 2) return false;
  }
  return true;
};
