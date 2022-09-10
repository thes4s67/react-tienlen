# React Tien Len

Tien Len is a popular Vietnamese card game that is played with 2-4 players. The goal is to get rid of all your cards the quickest by beating your opponent's hands with various combinations. See [the rules](https://react-tienlen.vercel.app/) for more details.

[Live Demo](https://react-tienlen.vercel.app/)

<p><img src="https://react-tienlen.vercel.app/media/react-tien-len.png"></p>

## Highlights

- Realtime play with 2-4 players & messaging
- Host or join a game with an invite code
- Start a new game once one is done
- 40 second timer for each player to play a hand except for the first hand

## Libraries/Frameworks

- React/NextJS
- MUI
- Express
- Socket.io

## Game Logic

The game logic "engine" consists of several parts: the `gameList`, `game`, `player`, `deck`, `gameLogic`, & `cards`

- gameList - a class that holds all the games when the server starts
- game - a class that holds the info for each individual game
- player - a class that holds the info for each player such as player idx & cards
- gameLogic - contains methods & functions to determine if a hand played is valid
- cards - an array with 52 cards represented with their rank value and suit as a float. Example 3♠ is 3.1 and a 2♥ is 15.4. See more below on this logic

The card array uses a value classification for each card since in Tien Len the objective is to beat another opponent's hand with a higher rank and/or suit. In Tien Len, the cards are ranked & suits from lowest to highest: 3,4,5,6,7,8,9,10,J,Q,A,K,2 with suits ♠ ♣ ♦ ♥

To determine if a hand played is greater than the opponent's hand, we sum up the values and compare. However, there are cases when this logic breaks such: playing the same consectuive sequence but with different suits or bombs. With these exceptions, we determine if the hand is greater by looking at the highest suit or use separate logic for bombs.

Example: an opponent plays 3.1, 4.2, 5.3 and you play 3.2, 4.4, 5.1 - the sum is 12.6 & 12.7 - the opponent's hand is greater.

Example: an opponent plays 15.2 (2♣). The only way to beat this hand is with a 2 with a higher suit or a bomb. Bombs can be quads or paired consecutive sequences that must have at least 3 pairs or more.

## Game Security

This project makes no guarantees regarding game security or overall for that matter. However, the design of the project takes this into consideration:

- No non-essential game data is stored in React state such as other players' cards
- Each client connected to the socket server receives only important info to that player & overall info about the game such as number of players, whose turn it is, and each player's remaining cards.
- Even if a user manages to modify the state or make a separate socket connection, the initial game info is/can be compared to see if the data matches.

## Todo

- Spectate mode
- Automatic wins
