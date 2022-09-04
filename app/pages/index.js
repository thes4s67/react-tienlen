import { useEffect, useState } from "react";
import { Container, Card, Box, Typography } from "@mui/material";
import io from "socket.io-client";

const Home = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);
    newSocket.emit("getGames", "??");
    console.log("emitted");
    return () => newSocket.close();
  }, [setSocket]);
  return (
    <>
      <Container></Container>
    </>
  );
};

export default Home;
