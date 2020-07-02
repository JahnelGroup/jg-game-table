import { INVALID_MOVE } from "boardgame.io/core";

const WIDTH = 7;
const HEIGHT = 6;

//Board is 7x6
function setup() {
  return {
    cells: Array(WIDTH).fill(Array(HEIGHT).fill(null)),
  };
}

function clickColumn(G, ctx, column) {
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (G.cells[column][i] == null) {
      G.cells[column][i] = ctx.currentPlayer;
      G.lastMove = column;
      return;
    }
  }
  return INVALID_MOVE;
}

function isVictory(G, ctx) {
  let player = ctx.currentPlayer;

  // horizontalCheck
  for (let j = 0; j < HEIGHT - 3; j++) {
    for (let i = 0; i < WIDTH; i++) {
      if (
        G.cells[i][j] == player &&
        G.cells[i][j + 1] == player &&
        G.cells[i][j + 2] == player &&
        G.cells[i][j + 3] == player
      ) {
        return true;
      }
    }
  }

  // verticalCheck
  for (let i = 0; i < WIDTH - 3; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      if (
        G.cells[i][j] == player &&
        G.cells[i + 1][j] == player &&
        G.cells[i + 2][j] == player &&
        G.cells[i + 3][j] == player
      ) {
        return true;
      }
    }
  }

  // ascendingDiagonalCheck
  for (let i = 3; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT - 3; j++) {
      if (
        G.cells[i][j] == player &&
        G.cells[i - 1][j + 1] == player &&
        G.cells[i - 2][j + 2] == player &&
        G.cells[i - 3][j + 3] == player
      )
        return true;
    }
  }

  // descendingDiagonalCheck
  for (let i = 3; i < WIDTH; i++) {
    for (let j = 3; j < HEIGHT; j++) {
      if (
        G.cells[i][j] == player &&
        G.cells[i - 1][j - 1] == player &&
        G.cells[i - 2][j - 2] == player &&
        G.cells[i - 3][j - 3] == player
      )
        return true;
    }
  }
  return false;
}

function isDraw(G) {
  for (let i = 6; i >= 0; i--) {
    for (let j = 5; j >= 0; j--) {
      if (G.cells[i][j] == null) {
        return false;
      }
    }
  }
  return true;
}

export const ConnectFour = {
  name: "connect-four",

  setup: setup,

  moves: {
    clickColumn,
  },

  turn: {
    moveLimit: 1, // makes it easier for bots
  },

  endIf: (G, ctx) => {
    if (isVictory(G, ctx)) {
      return { winner: ctx.currentPlayer };
    }
    if (isDraw(G)) {
      return { draw: true };
    }
  },

  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 6; i >= 0; i--) {
        if (G.cells[i][0] == null) {
          moves.push({ move: "clickColumn", args: [i] });
        }
      }
      return moves;
    },
  },
};
