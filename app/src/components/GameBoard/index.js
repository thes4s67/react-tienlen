import { Box, Button, Typography, Avatar } from "@mui/material";
import { useSocket } from "../../../src/store/SocketContext";
import PlayCard from "../PlayCard";
import BackOfCard from "../PlayCard/BackOfCard";

const GameBoard = ({ gameInfo, cards, id }) => {
  const { socket } = useSocket();
  const arrTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const handlePlayCard = (i) => {
    const tempCards = cards;
    tempCards[i] = { ...tempCards[i], active: !tempCards[i].active };
    setCards([...tempCards]);
  };
  return (
    <Box
      id="game-board"
      sx={{
        backgroundColor: "#308730",
        boxShadow: "#333 0 0 7px",
        height: 650,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 5,
        }}
      >
        <Avatar>P2</Avatar>
        {arrTest.map((c, i) => {
          return <BackOfCard key={`p1-${i}`} idx={i} side={false} />;
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: -10,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Avatar>P3</Avatar>
          {arrTest.map((c, i) => {
            return <BackOfCard key={`p1-${i}`} idx={i} side={true} />;
          })}
        </Box>
        <Box
          id={"board-center"}
          sx={{
            display: "flex",
            flextDirection: "row",
            alignItems: "center",
          }}
        >
          {gameInfo.started ? (
            <>
              {gameInfo.prevHand.map((c, i) => {
                const v = c.card.toString().split(".");
                return <PlayCard value={Number(v[0])} suit={Number(v[1])} />;
              })}
            </>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {gameInfo.players < 2 ? (
                <Typography variant="h5">
                  Waiting for more players to join...
                </Typography>
              ) : gameInfo.isHost && gameInfo.players >= 2 ? (
                <Button
                  variant="contained"
                  onClick={() => socket.emit("startGame", { code: id })}
                >
                  Start Game
                </Button>
              ) : (
                <Typography variant="h5">
                  Waiting for host to start game...
                </Typography>
              )}
              {!gameInfo.seated ? (
                <Button
                  variant="contained"
                  onClick={async () => {
                    socket.emit("joinGame", {
                      code: id,
                    });
                  }}
                >
                  Join
                </Button>
              ) : null}
            </Box>
          )}
        </Box>
        <Box>
          <Avatar>P4</Avatar>
          {arrTest.map((c, i) => {
            return <BackOfCard key={`p1-${i}`} idx={i} side={true} />;
          })}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: -10,
        }}
      >
        <Avatar>You</Avatar>
        {cards.map((c, i) => {
          const v = c.card.toString().split(".");
          return (
            <PlayCard
              key={`p1-${i}`}
              idx={i}
              active={c.active}
              value={Number(v[0])}
              suit={Number(v[1])}
              onClick={() => handlePlayCard(i)}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default GameBoard;
