const Server = require('boardgame.io/server').Server
const TicTacToe = require('./tic-tac-toe/tic-tac-toe-game').TicTacToe
const ConnectFour = require('./connect-four/connect-four-game').ConnectFour
const Schnapsen = require('./schnapsen/schnapsen-game').Schnapsen

const server = Server({
    games: [TicTacToe, ConnectFour, Schnapsen] 
})
server.run(8000)
