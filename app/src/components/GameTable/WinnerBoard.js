import { Box, Typography, Avatar } from "@mui/material";
const WinnerBoard = ({ winners }) => {
  return winners.length > 0 ? (
    <Box
      id="game-winners"
      sx={{
        display: "flex",
        backgroundColor: "#2a2929",
        boxShadow: "#333 0 0 7px",
        borderTop: "1px solid white",
        py: 1,
        px: 2,
        color: "#fff",
        justifyContent: "center",
      }}
    >
      {winners[0] !== undefined ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              p: 0.5,
              fontSize: 14,
              fontWeight: 700,
              backgroundColor: "#f38426",
            }}
          >
            1st
          </Avatar>
          <Typography variant="h6" sx={{ ml: 1 }}>
            P{winners[0] + 1}
          </Typography>
        </Box>
      ) : null}
      {winners[1] !== undefined ? (
        <Box sx={{ display: "flex", alignItems: "center", ml: 2.5 }}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              p: 0.5,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            2nd
          </Avatar>
          <Typography variant="h6" sx={{ ml: 1 }}>
            P{winners[1] + 1}
          </Typography>
        </Box>
      ) : null}
      {winners[2] !== undefined ? (
        <Box sx={{ display: "flex", alignItems: "center", ml: 2.5 }}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              p: 0.5,
              fontSize: 14,
              fontWeight: 700,
              backgroundColor: "#664a31",
            }}
          >
            3rd
          </Avatar>
          <Typography variant="h6" sx={{ ml: 1 }}>
            P{winners[2] + 1}
          </Typography>
        </Box>
      ) : null}
    </Box>
  ) : null;
};

export default WinnerBoard;
