import { Box, Button, Typography } from "@mui/material";

const ResetGame = ({ socket, gameInfo, id }) => {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#2a2929",
        boxShadow: "#333 0 0 7px",
        borderBottom: "1px solid white",
        py: 1,
        px: 2,
        color: "#fff",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        The game has ended
      </Typography>
      {gameInfo.isHost ? (
        <Button
          variant="contained"
          color={"warning"}
          sx={{
            ml: 3,
          }}
          onClick={() => socket.emit("startGame", { code: id })}
        >
          New Game
        </Button>
      ) : null}
    </Box>
  );
};

export default ResetGame;
