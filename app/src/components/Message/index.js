import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Popover,
  Typography,
  Avatar,
} from "@mui/material";
import { useSocket } from "../../store/SocketContext";

const MessageBox = ({ code, gameInfo }) => {
  const [openChat, setOpenChat] = useState(false);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("newMessage", (args) => {
      console.log(args, "we got a message");
      let tempHistory = messageHistory;
      tempHistory.push({ idx: args.idx, message: args.message });
      setMessageHistory(tempHistory);
    });
  }, [socket, messageHistory]);

  return (
    <>
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
          inputProps={{ maxLength: 50 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => {
            //TODO: once you fix the idx issue and format the table pass in playerIdx
            socket.emit("sendMessage", {
              code,
              idx: gameInfo.idx,
              message,
            });
            setMessage("");
          }}
        >
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
        <Box sx={{ p: 2, height: 250, width: 500, backgroundColor: "#fbfbfb" }}>
          {messageHistory.map((c, i) => {
            return (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border:
                    gameInfo.idx === c.idx
                      ? "1px solid #333"
                      : "1px solid #444c74",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: gameInfo.idx === c.idx ? "#333" : "#444c74",
                  width: "300px",
                  color: "white",
                  float: gameInfo.idx !== c.idx ? "right" : "",
                  mt: 1.5,
                }}
              >
                <Avatar variant="square" sx={{ backgroundColor: "green" }}>
                  {gameInfo.idx === c.idx ? "You" : `P${c.idx + 1}`}
                </Avatar>
                <Typography variant="subtitle2" sx={{ ml: 1.5 }}>
                  {c.message}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Popover>
    </>
  );
};

export default MessageBox;
