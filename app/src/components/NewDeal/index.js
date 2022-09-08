import { Box, Typography, Button } from "@mui/material";
import { useSocket } from "../../store/SocketContext";
const NewDeal = () => {
  const socket = useSocket();
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    ></Box>
  );
};

export default NewDeal;
