import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useSocket } from "../src/store/SocketContext";
import axios from "axios";
import { setPlayerId } from "../src/utils";
import { useRouter } from "next/router";
import Header from "../src/components/Header";

const Home = () => {
  const { socket } = useSocket();
  const [value, setValue] = useState("");
  const [hostLoading, setHostLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const route = useRouter();

  return (
    <>
      <Container sx={{ mt: 5, mb: 5 }}>
        <Header />
        <Card sx={{ p: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Button
              onClick={async () => {
                setHostLoading(true);
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
              {hostLoading ? (
                <CircularProgress color="error" size="1.5rem" />
              ) : (
                " Host Game"
              )}
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
                disabled={value === "" ? true : false}
                variant="contained"
                onClick={() => {
                  setJoinLoading(true);
                  route.push(`/game/${value}`);
                }}
              >
                {joinLoading ? (
                  <CircularProgress color="error" size="1.5rem" />
                ) : (
                  " Join Game"
                )}
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default Home;
