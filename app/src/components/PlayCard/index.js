import { Card, Box, Typography } from "@mui/material";
import Portrait from "./Portrait";

const PlayCard = ({ value, idx, suit, active, ...props }) => {
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
        width: 90,
        height: 130,
        mt: active ? -1 : 0,
        border: "1px solid #2e2e2e",
      }}
      {...props}
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
            fontWeight: 700,
          }}
        >
          <span>{getValue(value)}</span>
          <span>{getSuit(suit)}</span>
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
            mt: -4.5,
            color: suit > 2 ? "red" : "black",
            fontWeight: 700,
          }}
        >
          <span>{getValue(value)}</span>
          <span>{getSuit(suit)}</span>
        </Box>
      </Box>
    </Card>
  );
};

export default PlayCard;
