import React from 'react'
import { Client } from 'boardgame.io/react'
import { Local, SocketIO } from 'boardgame.io/multiplayer'

import { TicTacToe } from './tic-tac-toe/tic-tac-toe-game'
import { TicTacToeBoard } from './tic-tac-toe/TicTacToeBoard'

import { ConnectFour } from './connect-four/connect-four-game'
import { ConnectFourBoard } from './connect-four/ConnectFourBoard'


const TicTacToeClient = Client({ 
  game: TicTacToe,
  board: TicTacToeBoard,
  // multiplayer: Local()
  multiplayer: SocketIO({ server: 'localhost:8000' })
});

const ConnectFourClient = Client({ 
  game: ConnectFour,
  board: ConnectFourBoard,
  //multiplayer: Local()
  multiplayer: SocketIO({ server: 'localhost:8000' })
});

class App extends React.Component {
  state = { playerID: null };

  render() {
    if (this.state.playerID === null) {
      return (
        <div>
          <p>Play as</p>
          <button onClick={() => this.setState({ playerID: "0" })}>
            Player 0
          </button>
          <button onClick={() => this.setState({ playerID: "1" })}>
            Player 1
          </button>
        </div>
      );
    }
    return (
      <div>
        <ConnectFourClient playerID={this.state.playerID}
        // gameID
        />
      </div>
    );
  }
}

export default App;
