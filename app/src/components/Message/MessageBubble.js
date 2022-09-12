import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const MessageWrapper = styled(Box)(
  ({ theme }) => `
  filter: drop-shadow(-1px -1px 2px rgba(0, 0, 0, 0.1)) 
          drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.15));
  margin: 1rem;
  marginBottom: 40px;
  border-radius: 5px;
  padding: 1rem;
  position: relative;
  background: ${theme.palette.primary.main};
  opacity: .9;
  width: 100px;
  color: white;
    `
);

const MessageBubble = ({ pos, small, message }) => {
  const getTop = () => {
    if (pos === "top") return small ? "32.5%" : "26.5%";
    // if (pos === "bottom") return small ? "-45%" : "-40%";
    if (pos === "bottom") return small ? "77%" : "63%";
    if (pos === "right") return small ? "50%" : "45%";
    if (pos === "left") return small ? "50%" : "45%";
  };
  const getLeft = () => {
    if (pos === "top") return small ? "35%" : "46%";
    if (pos === "bottom") return small ? "33%" : "60%";
    if (pos === "right") return small ? "56.5%" : "67.5%";
    if (pos === "left") return small ? "9.5%" : "24%";
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        top: getTop(),
        left: getLeft(),
      }}
    >
      <MessageWrapper left={""} bottom={""} transform={""}>
        <Typography variant="subtitle2" sx={{ fontSize: small ? 10 : 12 }}>
          {message}
        </Typography>
      </MessageWrapper>
    </Box>
  );
};

export default MessageBubble;
