export const setPlayerId = (id) => {
  localStorage.setItem("playerId", id);
};

export const getPlayerId = () => {
  return localStorage.getItem("playerId");
};

export const getPlayerNumber = (tableOrder, pos) => {
  try {
    const players = tableOrder.length + 1;
    if (pos === "top") {
      if (players === 2) return `P${tableOrder[0] + 1}`;
      if (players === 4) return `P${tableOrder[1] + 1}`;
    }
    if (pos === "left") {
      if (players > 2) return `P${tableOrder[0] + 1}`;
    }
    if (pos === "right") {
      if (players === 3) return `P${tableOrder[1] + 1}`;
      if (players === 4) return `P${tableOrder[2] + 1}`;
    }
  } catch (error) {
    //game hasnt started
    return null;
  }
};

export const getPlayerCards = (tableOrder, playerCards, pos) => {
  try {
    const players = tableOrder.length + 1;
    let len = 0;
    if (pos === "top") {
      if (players === 2) len = playerCards[tableOrder[0]];
      if (players === 4) len = playerCards[tableOrder[1]];
    }
    if (pos === "left") {
      if (players > 2) len = playerCards[tableOrder[0]];
    }
    if (pos === "right") {
      if (players === 3) len = playerCards[tableOrder[1]];
      if (players === 4) len = playerCards[tableOrder[2]];
    }
    return [...new Array(len)];
  } catch (error) {
    //game hasn't started
    return [...new Array(13)];
  }
};
export const getPlayerTurn = (tableOrder, playerTurn, pos, players) => {
  console.log(tableOrder, playerTurn, pos);
  try {
    if (pos === "top") {
      if (players === 2)
        return tableOrder[0] == playerTurn ? "#2a2929" : "#bdbdbd";
      if (players === 4)
        return tableOrder[1] === playerTurn ? "#2a2929" : "#bdbdbd";
    }
    if (pos === "left") {
      if (players > 2)
        return tableOrder[0] === playerTurn ? "#2a2929" : "#bdbdbd";
    }
    if (pos === "right") {
      if (players === 3)
        return tableOrder[1] === playerTurn ? "#2a2929" : "#bdbdbd";
      if (players === 4)
        return tableOrder[2] === playerTurn ? "#2a2929" : "#bdbdbd";
    }
  } catch (error) {
    //game hasn't started
    return null;
  }
};
