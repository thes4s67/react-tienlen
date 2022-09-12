import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Snackbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BackOfCard from "../../../src/components/PlayCard/BackOfCard";
import PlayCard from "../../../src/components/PlayCard";
import GamePrompt from "../../../src/components/GamePrompt";
import MessageBox from "../../../src/components/Message";
import { useSocket } from "../../../src/store/SocketContext";
import useTimer from "../../../src/hooks/useTimer";
import CloseIcon from "@mui/icons-material/Close";
import GameInfo from "../../../src/components/GameTable/GameInfo";
import {
  getPlayerNumber,
  getPlayerCards,
  getPlayerTurn,
  getPlayerPos,
} from "../../../src/utils";
import GameEndPrompt from "../../../src/components/GameTable/GameEndPrompt";
import MessageBubble from "../../../src/components/Message/MessageBubble";

const GameRoom = ({ id }) => {
  const [gameInfo, setGameInfo] = useState({});
  const [cards, setCards] = useState([]);
  const [openError, setOpenError] = useState(false);
  const [message, setMessage] = useState({ pos: null, message: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(null);
  const { socket } = useSocket();
  // const { startTimer, timer, setTimer } = useTimer(
  //   gameInfo.started,
  //   gameInfo.firstHand,
  //   gameInfo.gameEnd
  // );
  const theme = useTheme();
  const smallMedia = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    console.log(gameInfo, "yourGameInfo", gameInfo.playerTurn);
    if (Object.keys(gameInfo).length === 0) {
      socket.emit("getInitGameInfo", { code: id });
    }
    socket.on("initGameInfo", (args) => {
      setGameInfo(args);
    });
    //functional update to prevent from multiple updates colliding
    const updateEvent = (args, name, value) => {
      let temp = {};
      for (let [key, value] of Object.entries(args)) {
        if (key !== "cards" && key !== "msg") {
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
    });
    // socket.on("startTimer", (args) => {
    //   startTimer()
    // })
    socket.on("updateTimer", (args) => {
      console.log("are we getting anything??", args);
      setTimer(args.time);
    });
    socket.on("updatePlayerInfo", (args) => {
      if (args.msg !== undefined) {
        setErrorMsg(args.msg);
        setOpenError(true);
        updateEvent(args);
      } else {
        updateEvent(args);
      }
    });
    socket.on("newMessage", (args) => {
      if (args.idx === gameInfo.idx) {
        setMessage({ pos: "bottom", message: args.message });
      } else {
        if (gameInfo.tableOrder) {
          setMessage({
            pos: getPlayerPos(gameInfo.tableOrder, args.idx),
            message: args.message,
          });
        }
      }
      setTimeout(() => {
        setMessage({ pos: null, message: "" });
      }, 3800);
    });
    // if (gameInfo.playerTurn === gameInfo.idx && timer === 0) {
    //   console.log("we are passing correctly");
    //   setTimer(null);
    //   socket.emit("pass", { code: id, idx: gameInfo.idx });
    //   //set timer to -1 to auto skipping
    // }
  }, [socket, gameInfo, cards, timer]);

  const handlePlayCard = (i) => {
    const tempCards = cards;
    tempCards[i] = { ...tempCards[i], active: !tempCards[i].active };
    setCards([...tempCards]);
  };

  const checkHasActiveCard = () => {
    //prevents user from clicking play btn /w out an active card
    const active = cards.filter((c) => c.active);
    return active.length > 0 ? false : true;
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

  return (
    <>
      {Object.keys(gameInfo).length !== 0 && !gameInfo.exists ? (
        <GamePrompt />
      ) : (
        <>
          <GameInfo gameInfo={gameInfo} timer={timer} />
          <Box
            id="game-board"
            sx={{
              backgroundColor: "#308730",
              boxShadow: "#333 0 0 7px",
            }}
          >
            <Box
              id="top-player"
              sx={{
                visibility: checkVisibility("top"),
                height: 235,
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
                    mt: 2.5,
                    width: smallMedia ? "35px" : null,
                    height: smallMedia ? "35px" : null,
                    backgroundColor: getPlayerTurn(
                      gameInfo.tableOrder,
                      gameInfo.playerTurn,
                      "top",
                      gameInfo.players
                    ),
                  }}
                />
                <Typography variant="subtitle1">
                  {getPlayerNumber(gameInfo.tableOrder, "top")}
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
                {getPlayerCards(
                  gameInfo.tableOrder,
                  gameInfo.playersCards,
                  "top"
                ).map((c, i) => {
                  return (
                    <BackOfCard
                      key={`p1-${i}`}
                      idx={i}
                      side={false}
                      small={smallMedia}
                    />
                  );
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
                  display: smallMedia ? null : "flex",
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
                      width: smallMedia ? "35px" : null,
                      height: smallMedia ? "35px" : null,
                      backgroundColor: getPlayerTurn(
                        gameInfo.tableOrder,
                        gameInfo.playerTurn,
                        "left",
                        gameInfo.players
                      ),
                    }}
                  />
                  <Typography variant="subtitle1">
                    {getPlayerNumber(gameInfo.tableOrder, "left")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {getPlayerCards(
                    gameInfo.tableOrder,
                    gameInfo.playersCards,
                    "left"
                  ).map((c, i) => {
                    return (
                      <BackOfCard
                        key={`left-${i}`}
                        idx={i}
                        side={true}
                        small={smallMedia}
                      />
                    );
                  })}
                </Box>
              </Box>
              <Box
                id={"board-center"}
                sx={{
                  display: "flex",
                  flextDirection: "row",
                  alignItems: "center",
                  mt: 10,
                  height: 235,
                }}
              >
                {gameInfo.started ? (
                  <>
                    {gameInfo.prevHand.map((c, i) => {
                      const v = c.card.toString().split(".");
                      return (
                        <PlayCard
                          key={`${gameInfo.idx}-${i}`}
                          value={Number(v[0])}
                          suit={Number(v[1])}
                          small={smallMedia}
                        />
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
                      <>
                        <Typography variant="h6" sx={{ textAlign: "center" }}>
                          Waiting for more players to join...
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ textAlign: "center" }}
                        >
                          Invite friends with code{" "}
                          <span
                            style={{
                              borderRadius: 5,
                              padding: 5,
                              backgroundColor: theme.palette.primary.main,
                            }}
                          >
                            {id}
                          </span>
                        </Typography>
                      </>
                    ) : gameInfo.isHost && gameInfo.players >= 2 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => socket.emit("startGame", { code: id })}
                      >
                        Start Game
                      </Button>
                    ) : (
                      <Typography variant="h6" sx={{ textAlign: "center" }}>
                        Waiting for host to start game...
                      </Typography>
                    )}
                    {!gameInfo.seated ? (
                      <Button
                        variant="contained"
                        color="primary"
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
                  display: smallMedia ? "" : "flex",
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  mr: 2.5,
                  visibility: checkVisibility("right"),
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
                      width: smallMedia ? "35px" : null,
                      height: smallMedia ? "35px" : null,
                      backgroundColor: getPlayerTurn(
                        gameInfo.tableOrder,
                        gameInfo.playerTurn,
                        "right",
                        gameInfo.players
                      ),
                    }}
                  />
                  <Typography variant="subtitle1">
                    {getPlayerNumber(gameInfo.tableOrder, "right")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {getPlayerCards(
                    gameInfo.tableOrder,
                    gameInfo.playersCards,
                    "right"
                  ).map((c, i) => {
                    return (
                      <BackOfCard
                        key={`right-${i}`}
                        idx={i}
                        side={true}
                        small={smallMedia}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Box>
            <Box
              id="bottom-player"
              sx={{
                visibility: checkVisibility("bottom"),
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
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
                      small={smallMedia}
                    />
                  );
                })}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Button
                  color={"error"}
                  variant="contained"
                  disabled={
                    gameInfo.firstHand ||
                    gameInfo.gameEnd ||
                    gameInfo.playerTurn !== gameInfo.idx ||
                    gameInfo.prevHandPlayer == gameInfo.idx
                  }
                  onClick={() =>
                    socket.emit("pass", { code: id, idx: gameInfo.idx })
                  }
                >
                  Pass
                </Button>
                <Avatar
                  sx={{
                    p: smallMedia ? 0.5 : 0.2,
                    width: smallMedia ? "35px" : null,
                    height: smallMedia ? "35px" : null,
                    backgroundColor:
                      gameInfo.playerTurn === gameInfo.idx
                        ? "#2a2929"
                        : "#bdbdbd",
                  }}
                >
                  You
                </Avatar>
                <Button
                  color={"primary"}
                  variant="contained"
                  disabled={
                    gameInfo.playerTurn !== gameInfo.idx ||
                    gameInfo.gameEnd ||
                    checkHasActiveCard()
                  }
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
          {message.pos !== null ? (
            <MessageBubble
              pos={message.pos}
              small={smallMedia}
              message={message.message}
            />
          ) : null}
          {gameInfo.gameEnd ? (
            <GameEndPrompt
              open={gameInfo.gameEnd}
              gameInfo={gameInfo}
              id={id}
              socket={socket}
            />
          ) : null}
        </>
      )}
      <Snackbar
        open={openError}
        autoHideDuration={3000}
        ContentProps={{ sx: { display: "block", textAlign: "center" } }}
        onClose={() => setOpenError(false)}
        message={errorMsg}
        anchorOrigin={{ vertical: "botton", horizontal: "center" }}
        // action={
        //   <IconButton
        //     size="small"
        //     aria-label="close"
        //     color="inherit"
        //     onClick={() => setOpenError(false)}
        //   >
        //     <CloseIcon fontSize="small" />
        //   </IconButton>
        // }
      />
    </>
  );
};

export default GameRoom;
GameRoom.getInitialProps = async ({ query }) => {
  const { id } = query;
  return { id };
};
