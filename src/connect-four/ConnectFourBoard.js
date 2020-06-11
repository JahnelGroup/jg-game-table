import React from 'react'

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

        const cellStyle = {
            border: '1px solid #555',
            width: '50px',
            height: '50px',
            lineHeight: '50px',
            textAlign: 'center',
        }

        let tbody = []
        for (let i = 0; i < 6; i++) {
            let cells = []
            for (let j = 0; j < 7; j++) {
                const id = j + (i * 7);
                cells.push(
                <td style={cellStyle} key={id} 
                    onClick={() => this.onClick(j)}>
                    { this.props.G.cells[j][i] }
                    </td>
                )
            }
            tbody.push(<tr key={i}>{cells}</tr>)
        }

        return (
            <div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
                { winner }
            </div>
        )
    }
}
