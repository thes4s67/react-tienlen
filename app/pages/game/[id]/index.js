import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  Avatar,
  Snackbar,
  IconButton,
} from "@mui/material";
import BackOfCard from "../../../src/components/PlayCard/BackOfCard";
import PlayCard from "../../../src/components/PlayCard";
import GamePrompt from "../../../src/components/GamePrompt";
import MessageBox from "../../../src/components/Message";
import { useSocket } from "../../../src/store/SocketContext";
import useTimer from "../../../src/hooks/useTimer";
import CloseIcon from "@mui/icons-material/Close";

const GameRoom = ({ id }) => {
  const [gameInfo, setGameInfo] = useState({});
  const [cards, setCards] = useState([]);
  const [openError, setOpenError] = useState(false);
  const { socket } = useSocket();
  const { resetTimer, timer } = useTimer(gameInfo.started);
  const arrTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  useEffect(() => {
    console.log(gameInfo, "yourGameInfo");
    if (Object.keys(gameInfo).length === 0) {
      socket.emit("getInitGameInfo", { code: id });
    }
    if (timer === 0) {
      console.log("timer hit 0");
      socket.emit("pass", { code: id, idx: gameInfo.playerTurn });
    }
    socket.on("initGameInfo", (args) => {
      setGameInfo(args);
    });
    if (timer === 0) {
      //pass
      console.log("timer is 0");
    }
    //functional update to prevent from multiple updates colliding
    const updateEvent = (args, name, value) => {
      let temp = {};
      for (let [key, value] of Object.entries(args)) {
        if (key !== "cards" && key !== "badPlay") {
          temp = { ...temp, [key]: value };
        }
      }
      setGameInfo((prev) => ({ ...prev, ...temp }));
      if (args.cards) {
        setCards(args.cards);
      }
    };
    socket.on("updateGameInfo", (args) => {
      updateEvent(args);
      console.log("is this called?");
      resetTimer();
    });
    socket.on("updatePlayerInfo", (args) => {
      if (args.badPlay !== undefined) {
        setOpenError(true);
      } else {
        updateEvent(args);
      }
    });
  }, [socket, gameInfo, cards, timer]);

  const handlePlayCard = (i) => {
    const tempCards = cards;
    tempCards[i] = { ...tempCards[i], active: !tempCards[i].active };
    setCards([...tempCards]);
  };

  const checkVisibility = (pos) => {
    if (pos === "bottom" && gameInfo.started) return null;
    if (
      pos === "top" &&
      (gameInfo.players === 2 || gameInfo.players === 4) &&
      gameInfo.started
    )
      return null;
    if (
      (pos === "left" || pos === "right") &&
      (gameInfo.players === 3 || gameInfo.players === 4) &&
      gameInfo.started
    )
      return null;
    return "hidden";
  };

  const getPlayerNum = (pos) => {
    try {
      const tempSO = gameInfo.seatingOrder
        .filter((c) => c !== gameInfo.idx)
        .reverse();
      if (gameInfo.players === 2) {
        return `P${tempSO[0] + 1}`;
      }
      if (gameInfo.players === 3) {
        if (pos === "left") return `P${tempSO[0] + 1}`;
        if (pos === "right") return `P${tempSO[1] + 1}`;
      }
      if (gameInfo.players === 4) {
        if (pos === "left") return `P${tempSO[0] + 1}`;
        if (pos === "top") return `P${tempSO[1] + 1}`;
        if (pos === "right") return `P${tempSO[2] + 1}`;
      }
    } catch (error) {
      return;
    }
  };

  const getPlayerCards = (pos) => {
    if (!gameInfo.started) return [...new Array(13)];
    const tempSO = gameInfo.seatingOrder
      .filter((c) => c !== gameInfo.idx)
      .reverse();
    // console.log(tempSO, "the TempSO", gameInfo.playersCards);
    let len = 0;
    if (gameInfo.players === 2) {
      len = gameInfo.playersCards[tempSO[0]];
    }
    if (gameInfo.players === 3) {
      if (pos === "left") len = gameInfo.playersCards[tempSO[0]];
      if (pos === "right") len = gameInfo.playersCards[tempSO[1]];
    }
    if (gameInfo.players === 4) {
      if (pos === "left") len = gameInfo.playersCards[tempSO[0]];
      if (pos === "top") len = gameInfo.playersCards[tempSO[1]];
      if (pos === "right") len = gameInfo.playersCards[tempSO[3]];
    }
    return [...new Array(len)];
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
            {gameInfo.started ? (
              <Typography>
                {gameInfo.playerTurn === gameInfo.idx
                  ? "Your turn"
                  : `Waiting For Player ${gameInfo.playerTurn + 1}`}{" "}
                {`(00:${timer < 10 ? `0${timer}` : timer})`}
              </Typography>
            ) : null}
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
            <Box id="top-player" sx={{ visibility: checkVisibility("top") }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <Avatar
                  sx={{
                    mt: 2.5,
                    backgroundColor:
                      gameInfo.playerTurn !== gameInfo.idx
                        ? "#2a2929"
                        : "#bdbdbd",
                  }}
                />
                <Typography variant="subtitle1">
                  {getPlayerNum("top")}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: -4,
                  p: 5,
                }}
              >
                {getPlayerCards("top").map((c, i) => {
                  return <BackOfCard key={`p1-${i}`} idx={i} side={false} />;
                })}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: -10,
              }}
            >
              <Box
                id="left-player"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  ml: 2.5,
                  visibility: checkVisibility("left"),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor:
                        gameInfo.playerTurn !== gameInfo.idx
                          ? "#2a2929"
                          : "#bdbdbd",
                    }}
                  />
                  <Typography variant="subtitle1">
                    {getPlayerNum("left")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {getPlayerCards("left").map((c, i) => {
                    return <BackOfCard key={`left-${i}`} idx={i} side={true} />;
                  })}
                </Box>
              </Box>
              <Box
                id={"board-center"}
                sx={{
                  display: "flex",
                  flextDirection: "row",
                  alignItems: "center",
                  mt: cards.length > 0 ? -6 : 0,
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      color: "white",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    {gameInfo.players < 2 ? (
                      <Typography variant="h6">
                        Waiting for more players to join...
                      </Typography>
                    ) : gameInfo.isHost && gameInfo.players >= 2 ? (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => socket.emit("startGame", { code: id })}
                      >
                        Start Game
                      </Button>
                    ) : (
                      <Typography variant="h6">
                        Waiting for host to start game...
                      </Typography>
                    )}
                    {!gameInfo.seated ? (
                      <Button
                        variant="contained"
                        color="warning"
                        sx={{ mt: 2 }}
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
              <Box
                id="right-player"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mr: 2.5,
                  visibility: checkVisibility("right"),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {getPlayerCards("right").map((c, i) => {
                    return (
                      <BackOfCard key={`right-${i}`} idx={i} side={true} />
                    );
                  })}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor:
                        gameInfo.playerTurn !== gameInfo.idx
                          ? "#2a2929"
                          : "#bdbdbd",
                    }}
                  />
                  <Typography variant="subtitle1">
                    {getPlayerNum("right")}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              id="bottom-player"
              sx={{ visibility: checkVisibility("bottom") }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  mt: -12,
                }}
              >
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  mt: cards.length > 0 ? 2 : 18,
                }}
              >
                <Button
                  color={"error"}
                  variant="contained"
                  disabled={
                    gameInfo.firstHand || gameInfo.playerTurn !== gameInfo.idx
                  }
                  onClick={() =>
                    socket.emit("pass", { code: id, idx: gameInfo.idx })
                  }
                >
                  Pass
                </Button>
                <Avatar
                  sx={{
                    p: 0.2,
                    backgroundColor:
                      gameInfo.playerTurn === gameInfo.idx
                        ? "#2a2929"
                        : "#bdbdbd",
                  }}
                >
                  You
                </Avatar>
                <Button
                  color={"warning"}
                  variant="contained"
                  disabled={gameInfo.playerTurn !== gameInfo.idx}
                  onClick={() =>
                    socket.emit("playCard", {
                      code: id,
                      cards: cards.filter((c) => c.active === true),
                      idx: gameInfo.idx,
                    })
                  }
                >
                  Play
                </Button>
              </Box>
            </Box>
          </Box>
          <MessageBox code={id} gameInfo={gameInfo} />
        </Container>
      )}
      <Snackbar
        open={openError}
        autoHideDuration={3000}
        onClose={() => setOpenError(false)}
        message="This is an invalid hand!"
        anchorOrigin={{ vertical: "botton", horizontal: "center" }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenError(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default GameRoom;
GameRoom.getInitialProps = async ({ query }) => {
  const { id } = query;
  return { id };
};
