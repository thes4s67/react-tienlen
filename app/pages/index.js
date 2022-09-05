import { useEffect, useState } from "react";
import { Container, Card, Button, Box, TextField } from "@mui/material";
import { useSocket } from "../src/store/SocketContext";
import axios from "axios";
import { setPlayerId } from "../src/utils";

const Home = () => {
  const { socket, setSocket } = useSocket();
  // useEffect(() => {
  //   const _socket = io("http://localhost:5001");
  //   setSocket(_socket);
  //   return () => _socket.close();
  // }, [setSocket]);
  return (
    <>
      <Container sx={{ mt: 5, mb: 5 }}>
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Button
              onClick={async () => {
                const { data } = await axios.post(
                  "http://localhost:5001/api/register"
                );
                setPlayerId(data.playerId);
                socket.emit("createGame", {
                  host: data.playerId,
                  code: data.code,
                });
                window.open(`http://localhost:3000/game/${data.code}`, "_self");
              }}
              variant="contained"
            >
              Host Game
            </Button>
            <Box
              sx={{
                display: "flex",
                mt: 2,
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ flexGrow: 0.7, mr: 2 }}
                label="Outlined"
                variant="outlined"
              />
              <Button sx={{ flexGrow: 0.3 }} variant="contained">
                Join Game
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default Home;
