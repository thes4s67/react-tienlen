import { useState } from "react";
import Head from "next/head";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  Container,
} from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";
const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Multiplayer Tien Len</title>
        <meta
          name="description"
          content="Play Tien Len with your friends for free!"
        />
        <meta
          name="keywords"
          content="tien len,thirteen,vietnamese,vietnamese card game,card game,cards"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "white",
          p: 2,
          mb: 3.5,
          height: 25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#11192a",
            boxShadow: "#000000 0 0 7px",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <IconButton
            sx={{ color: "white" }}
            onClick={() => window.open(process.env.CLIENT_URL, "_self")}
          >
            <img src={"./media/logo.svg"} height={50} width={50} />
            <Typography variant="h6" sx={{ fontWeight: 700, ml: 2 }}>
              Tien Len
            </Typography>
          </IconButton>
        </Box>
        <Tooltip title="Show rules">
          <IconButton onClick={() => setOpen(true)}>
            <QuestionMarkIcon sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <Container sx={{ mt: 5, mb: 5 }}>
          <Box sx={{ color: "black" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5">Intro</Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Tien Len is Vietnam<span>&lsquo;</span>s most popular card game.
                It means to <b>Go Forward</b>. The card game is called Thirteen
                in English. The rules below are based on a popular variation of
                Tien Len.
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Game Play
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                The card game is played with 2-4 players with each player
                receiving 13 cards out of a traditional 52 deck of cards. The
                goal of the card game is to get rid of all your cards the
                earliest by playing different combinations to beat your opponent
                <span>&lsquo;</span>s hand. Each player gets a turn to play a
                higher hand or pass in clockwise order. The player with the
                lowest card starts the game.
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                The card rank and suit matters in Tien Len. The lowest card is
                the 3<span>♠</span> and the highest card is the 2
                <span style={{ color: "red" }}>♥</span>. From least to greatest
                3,4,5,6,7,8,9,10,J,Q,K,A,2. The <span>♠</span> is the lowest
                suit, then <span>♣</span>, then{" "}
                <span style={{ color: "red" }}>♦</span>, and{" "}
                <span style={{ color: "red" }}>♥</span> being the highest. If
                card hands are the same rank, the highest suit wins.
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                The objective of the game is to play hands that beat your
                opponent<span>&lsquo;</span>s hand. There are various ways to
                play a hand:
                <br />
                <br />
                Singles: Opponent plays J♣, you can beat this hand with any
                single card that is higher in rank and/or suit. The J♠ does not
                beat this hand. Only cards greater or equal to J
                <span style={{ color: "red" }}>♦</span> can.
                <br />
                <br />
                Pairs: Opponent plays 9♣ & 9
                <span style={{ color: "red" }}>♦</span>, you can beat this hand
                with any pair that is higher in rank and/or suit. Pairs must
                have the same rank.
                <br />
                <br />
                Triples: Opponent plays 4♣ & 4
                <span style={{ color: "red" }}>♦</span> & 4
                <span style={{ color: "red" }}>♥</span>, you can beat this hand
                with any triples that is higher in rank and/or suit. Triples
                must have the same rank.
                <br />
                <br />
                Four of a Kind: Opponent plays 7♠ & 7♣ & 7
                <span style={{ color: "red" }}>♦</span> & 7
                <span style={{ color: "red" }}>♥</span>, you can beat this hand
                with any Four of a Kind that is higher in rank and/or suit. Four
                of a Kind must have the same rank.
                <br />
                <br />
                Single Consecutive Sequence: Opponent plays 3♠ & 4♣ & 5♠, you
                can beat this hand with any Single Consecutive Sequence that is
                higher in rank and/or suit & same length. Single Consecutive
                Sequences must have <b>at least 3</b> cards (length). Valid
                single consecutive sequence can be anywhere between:
                3,4,5,6,7,8,9,10,J,Q,K,A. Note K,A,2 is not valid.
                <br />
                <br />
                Pair Consecutive Sequence: Opponent plays 10♠ 10♣ & J♣ J♠ & Q
                <span style={{ color: "red" }}>♦</span> Q♣, you can beat this
                hand with any Pair Consecutive Sequence that is higher in rank
                and/or suit & same length. Pair Consecutive Sequences must have{" "}
                <b>at least 3</b> pairs (length). All pairs must have the same
                rank.
                <br />
                <br />
                Bombs: The 2 is the highest card in Tien Len. Only a greater
                combination 2 can beat the card with the exception of bombs.
                Opponent plays 2<span style={{ color: "red" }}>♦</span>, you can
                beat this hand with a 2<span style={{ color: "red" }}>♥</span>{" "}
                or with a bomb such as a Four of a Kind or any Pair Consecutive
                Sequence with a length of at least 3 pairs. Opponent plays 2♠ &
                2<span style={{ color: "red" }}>♥</span>, you can beat this hand
                with a Pair Consecutive Sequence that has a length of{" "}
                <b>at least 4</b> pairs. Nothing can beat triple 2
                <span>&lsquo;</span>s. Four of a Kind of 2<span>&lsquo;</span>s
                is an automatic win. You can also beat another player
                <span>&lsquo;</span>s bomb as long as your bomb is greater in
                rank and/or suit and their bomb is the same type of combination
                and length.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Header;
