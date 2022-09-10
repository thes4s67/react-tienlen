import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useRouter } from "next/router";

const GameEndPrompt = ({ open, gameInfo, id, socket }) => {
  const route = useRouter();

  const renderWinners = () => {
    if (gameInfo && gameInfo.winners.length > 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <List>
            {gameInfo.winners.map((c, i) => {
              return (
                <>
                  <ListItem
                    disablePadding
                    sx={{ mb: i !== gameInfo.winners.length - 1 ? 1.5 : 0 }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          p: 0.5,
                          fontSize: 14,
                          fontWeight: 700,
                          backgroundColor: "#11192a",
                        }}
                      >
                        {i + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={`Player ${c + 1}`} />
                  </ListItem>
                </>
              );
            })}
          </List>
        </Box>
      );
    }
  };
  return (
    <Dialog
      open={open}
      aria-labelledby="game-end-dialog-title"
      aria-describedby="game-end-dialog-description"
    >
      <DialogTitle id="game-end-dialog-title">{"Game ended!"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="game-end-dialog-description">
          The game has ended. Wait for the host of the game to start a new one.
        </DialogContentText>
        {renderWinners()}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => route.push("/")}>
          Leave Game
        </Button>
        {gameInfo.isHost && gameInfo.players > 1 ? (
          <Button
            variant="contained"
            onClick={() => socket.emit("startGame", { code: id })}
          >
            New Game
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default GameEndPrompt;
