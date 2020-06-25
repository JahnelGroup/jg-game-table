import React from 'react'

import { Lobby } from 'boardgame.io/react'

import { TicTacToe } from './tic-tac-toe/tic-tac-toe-game'
import { TicTacToeBoard } from './tic-tac-toe/TicTacToeBoard'


let components =  [
      {
        board: TicTacToeBoard,
        game: { ...TicTacToe, minPlayers: 1, maxPlayers: 2 },
      },
      { board: 'Board2', game: { name: 'GameName2' } },
      {
        board: 'Board3',
        game: { name: 'GameName3', minPlayers: 1, maxPlayers: 1 },
      },
    ];


class LobbyWrapper extends React.Component {

	render() {

    return (
      <div>
        <Lobby 
          gameComponents={components}
	      debug={true}
          lobbyServer="http://localhost:8000"
          gameServer="http://localhost:8000"
        
        />
      </div>
    );
  }
}




export default LobbyWrapper;
