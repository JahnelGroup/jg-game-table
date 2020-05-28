// Return true if `cells` is in a winning configuration
function isVictory(cells) {
    const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    if (wins.some(win => 
        win.every(cell => cells[cell] === "0") ||
        win.every(cell => cells[cell] === "1")
        )) return true
    return false
}

// Return true if all `cells` are occupied
function isDraw(cells) {
    return cells.filter(c => c === null).length === 0;
}



export const TicTacToe = {
    name: 'tic-tac-toe',
    
    setup: () => ({ cells: Array(9).fill(null) }),

    moves: {
        clickCell: (G, ctx, id) => {
            G.cells[id] = ctx.currentPlayer;
        },
    },

    turn: {
        moveLimit: 1, // makes it easier for bots
    },

    endIf: (G, ctx) => {
        if (isVictory(G.cells)) {
            return { winner: ctx.currentPlayer }
        }
        if (isDraw(G.cells)) {
            return { draw: true }
        }
    },

    ai: {
        enumerate: (G, ctx) => {
            let moves = []
            for (let i = 0; i < 9; i++) {
                if (G.cells[i] === null) {
                moves.push({ move: 'clickCell', args: [i] })
                }
            }
            return moves
        }
    }
}
