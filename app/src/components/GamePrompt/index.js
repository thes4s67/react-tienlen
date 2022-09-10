import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

const GamePrompt = ({ gameInfo }) => {
  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Error`}</DialogTitle>
      <DialogContent>
        The game room could not be found. Try entering another game room.
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            window.open(
              process.env.CLIENT_URL || "http://localhost:3000",
              "_self"
            );
          }}
        >
          Go to Lobby
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GamePrompt;
