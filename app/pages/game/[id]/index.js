import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  Popover,
} from "@mui/material";
import BackOfCard from "../../../src/components/PlayCard/BackOfCard";
import PlayCard from "../../../src/components/PlayCard";
import { getPlayerId } from "../../../src/utils";
import axios from "axios";
import GamePrompt from "../../../src/components/GamePrompt";

const GameRoom = ({ id }) => {
  const [gameInfo, setGameInfo] = useState({});
  const [timer, setTimer] = useState(40);
  const [openChat, setOpenChat] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const arrTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  useEffect(() => {
    axios
      .post(`http://localhost:5001/api/games/${id}`, {
        playerId: getPlayerId(),
      })
      .then((c) => setGameInfo(c.data));
  }, []);

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
                    <PlayCard value={10} suit={1} />
                    <PlayCard value={10} suit={2} />
                    <PlayCard value={10} suit={3} />
                  </>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {gameInfo.players < 2 ? (
                      <Typography variant="h5">
                        Waiting for more players to join...
                      </Typography>
                    ) : gameInfo.isHost && gameInfo.players >= 2 ? (
                      <Button variant="contained">Start Game</Button>
                    ) : (
                      <Typography variant="h5">
                        Waiting for host to start game...
                      </Typography>
                    )}
                    {!gameInfo.isHost &&
                    !gameInfo.seated &&
                    gameInfo.players < 4 ? (
                      <Button variant="contained">Join</Button>
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
              }}
            >
              <Avatar>You</Avatar>
              {arrTest.map((c, i) => {
                const v = c.toString().split(".");
                return (
                  <PlayCard
                    key={`p1-${i}`}
                    idx={i}
                    value={Number(v[0])}
                    suit={Number(v[1])}
                  />
                );
              })}
            </Box>
          </Box>
          <Box
            id="chat-box"
            sx={{
              backgroundColor: "#2a2929",
              boxShadow: "#333 0 0 7px",
              p: 1,
              display: "flex",
            }}
          >
            <TextField
              sx={{ backgroundColor: "#fff", flexGrow: 0.8 }}
              placeholder="Type your message..."
              inputProps={{ maxLength: 200 }}
            />
            <Button variant="contained" sx={{ mr: 2 }}>
              Send
            </Button>
            <Button
              variant="contained"
              sx={{ flexGrow: 0.2 }}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setOpenChat(!openChat);
              }}
            >
              Show Chat History
            </Button>
          </Box>
          <Popover
            sx={{ mt: -2 }}
            open={openChat}
            onClose={() => setOpenChat(false)}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <Box sx={{ p: 2, height: 150 }}>
              <Typography>Test</Typography>
              <Typography>Test</Typography>
              <Typography>Test</Typography>
              <Typography>Test</Typography>
              <Typography>Test</Typography>
              <Typography>Test</Typography>
              <Typography>Test</Typography>
            </Box>
          </Popover>
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
