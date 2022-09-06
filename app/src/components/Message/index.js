import { useState, useEffect } from "react";
import { Box, TextField, Button, Popover, Typography } from "@mui/material";
import { useSocket } from "../../store/SocketContext";
import { getPlayerId } from "../../utils";
const MessageBox = ({ code }) => {
  const [openChat, setOpenChat] = useState(false);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    // socket.on("newMessage", (args) => {
    //   console.log(args, "this works MessageBox");
    // });
  }, [socket]);

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
          inputProps={{ maxLength: 200 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => {
            socket.emit("sendMessage", {
              code,
              playerId: getPlayerId(),
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
    </>
  );
};

export default MessageBox;
