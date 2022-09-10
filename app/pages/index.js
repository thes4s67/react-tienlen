import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Box,
  TextField,
  CircularProgress,
  Typography,
  styled,
  Grid,
} from "@mui/material";
import { useSocket } from "../src/store/SocketContext";
import axios from "axios";
import { useRouter } from "next/router";

const Home = () => {
  const { socket } = useSocket();
  const [value, setValue] = useState("");
  const [hostLoading, setHostLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const route = useRouter();

  return (
    <>
      <Grid container spacing={4} sx={{ alignItems: "center" }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: "#11192a", color: "white" }}>
            <CardHeader
              title="Multiplayer Tien Len"
              subheader={
                <span style={{ color: "white" }}>
                  Play for free with your friends
                </span>
              }
            />
            <CardMedia
              component="img"
              height="500px"
              image="/media/react-tien-len.png"
              alt="Paella dish"
            />
            <CardContent sx={{ color: "white" }}>
              <Typography variant="body2">
                Tien Len is a popular Vietnamese card game. The goal is to get
                rid of all your cards the quickest. <br />
                <br />
                <br />
                Realtime multiplayer Tien Len with messaging!
                <br />
                Create or join a game and play with your friends!
              </Typography>
              <Typography sx={{ float: "right", mb: 1.5 }}>
                Play with 2-4 players
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Button
                onClick={async () => {
                  setHostLoading(true);
                  const { data } = await axios.post(
                    `${
                      process.env.SERVER_URL || "http://localhost:5001"
                    }/api/host`
                  );
                  socket.emit("createGame", {
                    code: data.code,
                  });
                  route.push(`/game/${data.code}`);
                }}
                variant="contained"
              >
                {hostLoading ? (
                  <CircularProgress color="info" size="1.5rem" />
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
                  label="Game Code"
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
                    <CircularProgress color="info" size="1.5rem" />
                  ) : (
                    "Join"
                  )}
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
