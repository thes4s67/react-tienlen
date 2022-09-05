export const generateGameCode = () => {
  return Math.random().toString(36).toUpperCase().slice(2).slice(0, 5);
};
