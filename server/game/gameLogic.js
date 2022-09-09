
/* Checks if hand played is valid */
export const isValidFirstHand = (hand, gameInfo) => {
  console.log(
    `Hand: ${hand}`,
    ` Lowest Card: ${gameInfo.lowestCard}`,
    ` Lowest Card Played: ${gameInfo.lowestCard === hand[0].card}`,
    ` Hand type: ${getHandType(hand) !== null}`,
    ` Hand name: ${getHandType(hand)}`
  );
  if (
    gameInfo.firstHand &&
    gameInfo.lowestCard === hand[0].card &&
    getHandType(hand) !== null
  ) {
    console.log("this is a valid first hand");
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
    console.log(
      `Hand LC: ${hand[hand.length - 1].card}`,
      `PrevHand LC: ${prev[prev.length - 1].card}`
    );
    const handLastSuit = hand[hand.length - 1].card.toString().split(".")[1];
    const prevLastSuit = prev[prev.length - 1].card.toString().split(".")[1];
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
  if (tempHand.length >= 2) {
    //pairs, trips, quads
    if (tempHandSum / tempHand.length === tempHand[0]) {
      console.log("checking if pairs, trips, or quads");
      if (tempHand.length === 2) return "Double";
      if (tempHand.length === 3) return "Triple";
      if (tempHand.length === 4) return "Quad";
    }
    //check if single sequence
    if (isSingleSequence(tempHand)) {
      console.log("hand is a single sequence");
      return "Sequence";
    }
    //check if pair sequence
    if (isPairSequence(tempHand)) {
      console.log("hand is a pair sequence");
      return "PairSquence";
    }
  }
  console.log("it actually gets to here");
  return null;
};

export const isTwoHand = (hand) => {
  for (let i = 0; i < hand.length; i++) {
    if (Math.floor(hand[i].card) !== 15) return false;
  }
  return true;
};

/*Consecutive sequence*/
const isSingleSequence = (tempHand) => {
  //if hand contains a 2
  if (tempHand[tempHand.length - 1] === 15) return false;
  for (let i = 0; i < tempHand.length - 1; i++) {
    if (tempHand[i + 1] - tempHand[i] !== 1) return false;
  }
  //hand must be at least 3 cards
  return true && tempHand.length >= 3;
};
/*Consecutive pair sequence*/
const isPairSequence = (tempHand) => {
  if (tempHand[tempHand.length - 1] === 15) return false;
  let counter = 0;
  let arr = tempHand.reduce((a, b) => {
    if (counter === 0) {
      a.push(b);
      counter++;
    } else {
      a[a.length - 1] += b;
      counter = 0;
    }
    return a;
  }, []);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i + 1] - arr[i] !== 2) return false;
  }
  //hand must contain at least 3 pairs
  return true && arr.length >= 3;
};

export const getTableOrder = (idx, seatingOrder) => {
  const a = seatingOrder.slice(0, idx);
  const b = seatingOrder.slice(idx + 1, seatingOrder.length);
  return [...b, ...a];
};

export const getPlayersCards = (idx, seatingOrder, playersCards) => {
  const tempSO = getTableOrder(idx, seatingOrder);
  let tempPC = [];
  for (let i = 0; i < tempSO.length; i++) {
    tempPC.push(playersCards[tempSO[i]]);
  }
  return tempPC;
};
