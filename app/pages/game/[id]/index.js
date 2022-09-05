import { useEffect, useState } from "react";
import { Container, Box, Button } from "@mui/material";
import BackOfCard from "../../../src/components/BackOfCard";
import PlayCard from "../../../src/components/PlayCard";
import io from "socket.io-client";

const GameRoom = ({ id }) => {
  const [gameInfo, setGameInfo] = useState([]);
  const [players, setPlayers] = useState([]);

  const arrTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  
  useEffect(() => {}, []);

  return (
    <>
      <Container
        sx={{
          backgroundColor: "green",
          boxShadow:
            "1px 1px 6px darkgrey inset, 1px 0px 2px grey inset,3px 4px 85px black inset, 1px 2px 6px black",
          mt: 10,
          mb: 10,
        }}
      >
        {arrTest ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            {arrTest.map((c, i) => {
              return <BackOfCard key={`p1-${i}`} idx={i} />;
            })}
          </Box>
        ) : null}
        {arrTest ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 2,
            }}
          >
            {arrTest.map((c, i) => {
              return <BackOfCard key={`p1-${i}`} idx={i} side={true} />;
            })}
          </Box>
        ) : null}

        {arrTest ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
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
        ) : null}
        <Box>
          <Button
            variant="contained"
            onClick={() => socket.emit("startGame", { host: "userFP" })}
          >
            Start Game
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default GameRoom;
GameRoom.getInitialProps = async ({ query }) => {
  const { id } = query;
  return { id };
};
