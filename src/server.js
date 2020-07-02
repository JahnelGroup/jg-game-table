const Server = require('boardgame.io/server').Server
const TicTacToe = require('./tic-tac-toe/tic-tac-toe-game').TicTacToe
const ConnectFour = require('./connect-four/connect-four-game').ConnectFour

const server = Server({ 
    games: [TicTacToe, ConnectFour] 
})
server.run(8000)