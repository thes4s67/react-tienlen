import { Box, Typography, useTheme } from "@mui/material";
const GameInfo = ({ gameInfo, timer }) => {
  const theme = useTheme();
  return (
    <Box
      id="game-info"
      sx={{
        display: "flex",
        backgroundColor: theme.palette.primary.main,
        boxShadow: `${theme.palette.primary.main} 0 0 7px`,
        py: 1,
        px: 2,
        color: "#fff",
        justifyContent: "space-between",
      }}
    >
      <Typography>Tien Len #{gameInfo.code}</Typography>
      {gameInfo.started && !gameInfo.gameEnd ? (
        <Typography>
          {gameInfo.playerTurn === gameInfo.idx
            ? "Your turn"
            : `Waiting For Player ${gameInfo.playerTurn + 1}`}{" "}
          {!gameInfo.firstHand && timer > 0
            ? `(00:${timer < 10 ? `0${timer}` : timer})`
            : null}
        </Typography>
      ) : null}
      <Typography>Players {gameInfo.players}/4</Typography>
    </Box>
  );
};

export default GameInfo;
