import { Card, Box, Typography } from "@mui/material";
import Portrait from "./Portrait";

const PlayCard = ({ value, idx, suit }) => {
  const getValue = (v) => {
    if (v === 11) return "J";
    if (v === 12) return "Q";
    if (v === 13) return "K";
    if (v === 14) return "A";
    if (v === 15) return "2";
    return v;
  };
  const getSuit = (v) => {
    if (v === 1) return "♠";
    if (v === 2) return "♣";
    if (v === 3) return "♦";
    if (v === 4) return "♥";
  };

  return (
    <Card
      sx={{
        ml: idx !== 0 ? -5 : 0,
        cursor: "pointer",
        width: 100,
        height: 150,
        // zIndex: idx === 0 ? 9999 : 0,
        mt: idx === 0 ? -1 : 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            p: 1,
            color: suit > 2 ? "red" : "black",
          }}
        >
          <Typography>{getValue(value)}</Typography>
          <Typography>{getSuit(suit)}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Portrait value={value} suit={suit} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            p: 1,
            color: suit > 2 ? "red" : "black",
          }}
        >
          <Typography>{getValue(value)}</Typography>
          <Typography>{getSuit(suit)}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default PlayCard;
