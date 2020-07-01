import React from 'react'
import { INVALID_MOVE } from "boardgame.io/core";

export class ConnectFourBoard extends React.Component {

    onClick(id) {
        this.props.moves.clickColumn(id);
    }

    isActive(id) {
        if (!this.props.isActive) return false;
        if (this.props.G.cells[id] !== null) return false;
        return true;
    }

    render() {
        let winner = <></>;
        if (this.props.ctx.gameover) {
            winner = 
                this.props.ctx.gameover.winner !== undefined ? (
                <div id="winner">Winner: { this.props.ctx.gameover.winner}</div>
                ) : (
                <div id="winner">Draw!</div>
                )
        }

        let lastMove = <></>;
        if (this.props.G.lastMove) {
            lastMove = <div id="last-move">{this.props.G.lastMove}</div>
        }

        const cellStyle = {
            border: '1px solid rgba(255, 0, 0, 0)',
            width: '84px',
            height: '75px',
            textAlign: 'center',
        }

        const chipStyle = {
            width: '71px',
            height: '71px',
            zIndex: '-2',
            marginLeft: '0px',
            marginTop: '0px',
        }

        const boardStyle = {
            display: 'block',
            position: 'absolute',
            zIndex: '-1',
            width: '640px',
            height: '481px',
        }

        const tableStyle = {
            marginLeft: '3px',
            marginTop: '1px',
        }

        let tbody = []
        for (let i = 0; i < 6; i++) {
            let cells = []
            for (let j = 0; j < 7; j++) {
                const id = j + (i * 7);
                let cell = '';
                if(this.props.G.cells[j][i] == 0){
                    cell = <img style={chipStyle} src={require('./assets/red_chip.svg')} alt='0' />
                }

                if(this.props.G.cells[j][i] == 1){
                    cell = <img style={chipStyle} src={require('./assets/yellow_chip.svg')} alt='0' />
                }
                cells.push(
                <td style={cellStyle} key={id} 
                    onClick={() => this.onClick(j)}>
                    {cell}
                    </td>
                )
            }
            tbody.push(<tr key={i}>{cells}</tr>)
        }

        let board = <img  style={boardStyle} src={require('./assets/board.png')} alt=''/>

        return (
            <div>
                {board}
                <table id="board" style={tableStyle}>
                    <tbody>{tbody}</tbody>
                </table>
                { lastMove }
                { winner }
            </div>
        )
    }
}
