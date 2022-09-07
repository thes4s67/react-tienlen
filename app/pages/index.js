import { useEffect, useState } from "react";
import { Container, Card, Button, Box, TextField } from "@mui/material";
import { useSocket } from "../src/store/SocketContext";
import axios from "axios";
import { setPlayerId } from "../src/utils";
import { useRouter } from "next/router";

const Home = () => {
  const { socket, setSocket } = useSocket();
  const [value, setValue] = useState("");
  const route = useRouter();
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
                  "http://localhost:5001/api/host"
                );
                socket.emit("createGame", {
                  code: data.code,
                });
                route.push(`/game/${data.code}`);
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
                value={value}
                onChange={(e) => setValue(e.target.value.toUpperCase())}
                inputProps={{ maxLength: 5 }}
                label="Game Room"
                variant="outlined"
              />
              <Button
                sx={{ flexGrow: 0.3 }}
                variant="contained"
                onClick={() => route.push(`/game/${value}`)}
              >
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
