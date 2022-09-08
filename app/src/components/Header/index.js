import { Box, Typography, IconButton } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
const Header = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#2c2c2c",
          borderRadius: 1,
          color: "white",
          p: 2,
          mb: 5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6">Multiplayer Tien Len</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <QuestionMarkIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography variant="h6">Rules</Typography>
        </Box>
      </Box>
    </>
  );
};

export default Header;
