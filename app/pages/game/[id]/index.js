import { useEffect, useState, useCallback } from "react";
import { Container, Box, Button, Typography, Avatar } from "@mui/material";
import BackOfCard from "../../../src/components/PlayCard/BackOfCard";
import PlayCard from "../../../src/components/PlayCard";
import GamePrompt from "../../../src/components/GamePrompt";
import MessageBox from "../../../src/components/Message";
import { useSocket } from "../../../src/store/SocketContext";

const GameRoom = ({ id }) => {
  const [gameInfo, setGameInfo] = useState({});
  const [cards, setCards] = useState([]);
  const [timer, setTimer] = useState(40);
  const { socket } = useSocket();
  const arrTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  useEffect(() => {
    if (Object.keys(gameInfo).length === 0) {
      socket.emit("getInitGameInfo", { code: id });
    }

    socket.on("initGameInfo", (args) => {
      setGameInfo(args);
    });
    //functional update to prevent from multiple updates colliding
    const updateEvent = (name, value) => {
      if (name !== "cards") {
        setGameInfo((prev) => ({ ...prev, [name]: value }));
      } else {
        setCards(value);
      }
    };
    socket.on("updateGameInfo", (args) => {
      if (args.players) {
        updateEvent("players", args.players);
      }
      if (args.started) {
        updateEvent("started", args.started);
      }
      if (args.seatingOrder) {
        updateEvent("seatingOrder", args.seatingOrder);
        console.log(args.seatingOrder, "this is the seating order");
      }
      if (args.playersCards) {
        updateEvent("playersCards", args.playersCards);
      }
      if (args.prevHand) {
        updateEvent("prevHand", args.prevHand);
      }
    });
    socket.on("updatePlayerInfo", (args) => {
      if (args.seated) {
        updateEvent("seated", args.seated);
      }
      if (args.idx) {
        updateEvent("idx", args.idx);
      }
      if (args.cards) {
        updateEvent("cards", args.cards);
      }
    });
    socket.on("newMessage", (args) => {
      console.log(args, "this works bro");
    });
  }, [socket, gameInfo, cards]);

  const handlePlayCard = (i) => {
    const tempCards = cards;
    console.log(i);
    tempCards[i] = { ...tempCards[i], active: !tempCards[i].active };
    setCards([...tempCards]);
  };
  const timerCountDown = () => {
    setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);
  };

  return (
    <>
      {Object.keys(gameInfo).length !== 0 && !gameInfo.exists ? (
        <GamePrompt />
      ) : (
        <Container sx={{ mt: 10, mb: 10 }}>
          <Box
            id="game-info"
            sx={{
              display: "flex",
              backgroundColor: "#2a2929",
              boxShadow: "#333 0 0 7px",
              py: 1,
              px: 2,
              color: "#fff",
              justifyContent: "space-between",
            }}
          >
            <Typography>Tien Len #{gameInfo.code}</Typography>
            <Typography>00:{timer}</Typography>
            <Typography>Players {gameInfo.players}/4</Typography>
          </Box>
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
                      return (
                        <PlayCard value={Number(v[0])} suit={Number(v[1])} />
                      );
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

            {gameInfo.started ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  justifyContent: "space-evenly",
                }}
              >
                <Button color={"error"} variant="contained">
                  Pass
                </Button>
                {cards.some((c) => c.active === true) ? (
                  <Button
                    color={"success"}
                    variant="contained"
                    onClick={() =>
                      socket.emit("playCard", {
                        code: id,
                        cards: cards.filter((c) => c.active === true),
                      })
                    }
                  >
                    Play
                  </Button>
                ) : null}
              </Box>
            ) : null}
          </Box>
          <MessageBox code={id} gameInfo={gameInfo} />
        </Container>
      )}
    </>
  );
};

export default GameRoom;
GameRoom.getInitialProps = async ({ query }) => {
  const { id } = query;
  return { id };
};
