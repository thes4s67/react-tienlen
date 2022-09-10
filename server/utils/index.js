export const generateGameCode = () => {
  return Math.random().toString(36).toUpperCase().slice(2).slice(0, 5);
};

export const getTopSize = (small, players) => {
  if (players === 2) return small ? 60 : 20;
  if (players >= 3) return small ? 40 : -70;
};
