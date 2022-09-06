import { Box, Typography } from "@mui/material";
import JackOfSpade from "./FaceCards/JackOfSpade";
import JackOfClub from "./FaceCards/JackOfClub";
import JackOfDiamond from "./FaceCards/JackOfDiamond";
import JackOfHeart from "./FaceCards/JackOfHeart";
import QueenOfSpade from "./FaceCards/QueenOfSpade";
import QueenOfClub from "./FaceCards/QueenOfClub";
import QueenOfDiamond from "./FaceCards/QueenOfDiamond";
import QueenOfHeart from "./FaceCards/QueenOfHeart";
import KingOfSpade from "./FaceCards/KingOfSpade";
import KingOfClub from "./FaceCards/KingOfClub";
import KingOfDiamond from "./FaceCards/KingOfDiamond";
import KingOfHeart from "./FaceCards/KingOfHeart";

const Portrait = ({ value, suit }) => {
  const getSuit = (v) => {
    if (v === 1) return "♠";
    if (v === 2) return "♣";
    if (v === 3) return "♦";
    if (v === 4) return "♥";
  };
  const getFaceCard = () => {
    if (value === 11 && suit === 1) return <JackOfSpade />;
    if (value === 11 && suit === 2) return <JackOfClub />;
    if (value === 11 && suit === 3) return <JackOfDiamond />;
    if (value === 11 && suit === 4) return <JackOfHeart />;
    if (value === 12 && suit === 1) return <QueenOfSpade />;
    if (value === 12 && suit === 2) return <QueenOfClub />;
    if (value === 12 && suit === 3) return <QueenOfDiamond />;
    if (value === 12 && suit === 4) return <QueenOfHeart />;
    if (value === 13 && suit === 1) return <KingOfSpade />;
    if (value === 13 && suit === 2) return <KingOfClub />;
    if (value === 13 && suit === 3) return <KingOfDiamond />;
    if (value === 13 && suit === 4) return <KingOfHeart />;
  };
  return (
    <>
      {value > 10 && value < 15 && value !== 14 ? (
        getFaceCard()
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 1
          }}
        >
          <Typography sx={{ fontSize: 30, color: suit > 2 ? "red" : "black" }}>{getSuit(suit)}</Typography>
          <Typography sx={{ fontSize: 30, color: suit > 2 ? "red" : "black" }}>{getSuit(suit)}</Typography>
          <Typography sx={{ fontSize: 30, color: suit > 2 ? "red" : "black" }}>{getSuit(suit)}</Typography>
        </Box>
      )}
    </>
  );
};

export default Portrait;
