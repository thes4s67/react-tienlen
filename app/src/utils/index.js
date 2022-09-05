export const setPlayerId = (id) => {
  localStorage.setItem("playerId", id);
};

export const getPlayerId = () => {
  return localStorage.getItem("playerId");
};
