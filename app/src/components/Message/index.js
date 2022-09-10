import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Popover,
  Typography,
  Avatar,
  styled,
  InputBase,
  Tooltip,
  IconButton,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useSocket } from "../../store/SocketContext";
// import Picker from "emoji-picker-react";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";

const Picker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

// console.log("?")

const MessageWrapper = styled(InputBase)(
  ({ theme }) => `
  padding: 1;
  width: 100%
`
);

const MessageBox = ({ code, gameInfo }) => {
  const [openChat, setOpenChat] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("newMessage", (args) => {
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
          backgroundColor: "#f2f5f9",
          boxShadow: "#11192a 0 0 7px",
          p: 1,
          display: "flex",
        }}
      >
        <Box flexGrow={1} display="flex" alignItems="center">
          <Avatar
            sx={{
              display: { xs: "none", sm: "flex" },
              mr: 1,
              backgroundColor: "#2a2929",
            }}
          />
          <MessageWrapper
            placeholder="Write your message..."
            fullWidth
            inputProps={{ maxLength: 50 }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>
        <Tooltip arrow placement="top" title={"Show emojis"}>
          <IconButton
            color="primary"
            onClick={(e) => {
              setAnchorEl2(e.currentTarget);
              setOpenEmoji(true);
            }}
          >
            😀
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top" title={"Show chat history"}>
          <IconButton
            color="primary"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setOpenChat(!openChat);
            }}
          >
            <SpeakerNotesIcon sx={{ color: "black" }} />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() => {
            if (message !== "") {
              socket.emit("sendMessage", {
                code,
                idx: gameInfo.idx,
                message,
              });
              setMessage("");
            }
          }}
        >
          Send
        </Button>
      </Box>
      <Popover
        // sx={{ mt: -2 }}
        open={openEmoji}
        onClose={() => setOpenEmoji(false)}
        anchorEl={anchorEl2}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Picker onEmojiClick={(e, t) => setMessage(`${message}${t.emoji}`)} />
      </Popover>
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
        {messageHistory.length > 0 ? (
          <Box
            sx={{ p: 2, height: 250, width: 500, backgroundColor: "#fbfbfb" }}
          >
            {messageHistory.map((c, i) => {
              return (
                <Box
                  key={`message-${i}`}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border:
                      gameInfo.idx === c.idx
                        ? "1px solid #333"
                        : "1px solid #444c74",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:
                      gameInfo.idx === c.idx ? "#333" : "#444c74",
                    width: "300px",
                    color: "white",
                    float: gameInfo.idx !== c.idx ? "right" : "",
                    mt: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "green",
                      fontSize: 14,
                      color: "2a2929",
                    }}
                  >
                    {gameInfo.idx === c.idx ? null : `P${c.idx + 1}`}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ ml: 1.5 }}>
                    {c.message}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              height: 250,
              width: 500,
              backgroundColor: "#fbfbfb",
            }}
          >
            <Typography variant="subtitle2">No messages yet...</Typography>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default MessageBox;
