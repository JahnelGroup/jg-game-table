import React from 'react';
import { INVALID_MOVE } from "boardgame.io/core";
import "./connect-four.css";

export class ConnectFourBoard extends React.Component {

    onClick(id) {
        this.props.moves.clickColumn(id);
    }

    newGame() {
        this.props.setup.setup();
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

        const cellStyle = {
            border: '1px solid rgba(255, 0, 0, 0)',
            width: '105px',
            height: '94px',
            textAlign: 'center',
        }

        const boardStyle = {
            display: 'block',
            position: 'absolute',
            zIndex: '-1',
            width: '800px',
            height: '600px',
        }

        const tableStyle = {
            marginLeft: '5px',
            marginTop: '1px',
            marginBottom:'5px'
        }

        let tbody = []
        for (let i = 0; i < 6; i++) {
            let cells = []
            for (let j = 0; j < 7; j++) {
                const id = j + (i * 7);
                let cell = '';

                let left = 112 * j + 18;
                let top = 100 * i + 7;

                let chipStyle = {
                    width: '92px',
                    height: '92px',
                    zIndex: '-2',
                    position:'absolute',
                    left: left + 'px',
                    top: top + 'px'
                }

                let className = '';

                if(j == this.props.G.lastMove){
                    if(this.props.G.cells[j][i - 1] == null){
                        className = 'slide-bottom';
                    }
                }

                if(this.props.G.cells[j][i] == 0){
                    cell = <img className={className} style={chipStyle} src={require('./assets/red_chip.svg')} alt='0' />
                }

                if(this.props.G.cells[j][i] == 1){
                    cell = <img className={className} style={chipStyle} src={require('./assets/yellow_chip.svg')} alt='0' />
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
                { winner }
            </div>
        )
    }
}
