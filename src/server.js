const Server = require('boardgame.io/server').Server
const TicTacToe = require('./tic-tac-toe/tic-tac-toe-game').TicTacToe

const server = Server({ 
    games: [TicTacToe] 
})
server.run(8000)