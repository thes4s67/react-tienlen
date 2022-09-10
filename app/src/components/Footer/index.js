import { Typography, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
const Footer = ({ mediaSize }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          px: 3,
          py: 1.5,
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
          mt: 1.5,
        }}
      >
        <Box>
          <Typography variant="h7">By Sonny N</Typography>
        </Box>
        <Box
          sx={{ display: "flex", cursor: "pointer", alignItems: "center" }}
          onClick={() =>
            window.open("https://github.com/thes4s67/react-tienlen", "_blank")
          }
        >
          <GitHubIcon />
          <Typography variant="h7" sx={{ ml: 1 }}>
            GitHub
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
