import React from 'react'

const suits = {
    'H': '♥️',
    'S': '♠️',
    'C': '♣️',
    'D': '♦️'
}

// sort
const suitOrder = 'CHSD'
const rankOrder = 'ATKQJ'
const sortCards = (a, b) => {
    if (a[1] === b[1]) return rankOrder.indexOf(a[0]) - rankOrder.indexOf(b[0])
    return suitOrder.indexOf(a[1]) - suitOrder.indexOf(b[1])
}
function display(card) {
    return card ? <div 
        style={{
            color: 'HD'.includes(card[1]) ? 'red' : 'black'
        }}>
        { card[0] }<br/> { suits[card[1]] }
    </div> : null
}
export class SchnapsenBoard extends React.Component {
    
    constructor(props) {
        super(props)
        this.playerID = this.props.playerID
    }

    playCard(card) {
        let marriage = 
            this.props.G.players[this.props.playerID].hand
            .filter(c => c[1] === card[1] && ['K', 'Q'].includes(c[0]))
        if (this.props.G.currentTrick.length === 0 && 
            'KQ'.includes(card[0]) && marriage.length === 2) {
            this.props.moves.DeclareMarriage(card)
        } else {
            this.props.moves.PlayCard(card)
        }
    }

    render() {
        let player = this.props.playerID
        let winner = '';
        if (this.props.ctx.gameover) {
            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                <div id="winner">Draw!</div>
                );
        }
        
        return (
            <div id="board">
                Dealer: { this.props.G.dealer }
                Player { player }

                <p> {this.props.G.gamePoints[player]} game points</p>
                <p> {this.props.G.points[player]} points</p>
                <p>player {this.props.ctx.currentPlayer}'s turn.</p>

                <h2 onClick={
                    () => this.props.moves.ExchangeTrump(
                    this.props.G.players[this.playerID].hand
                        .find(c => c === 'J' + this.props.G.trump)
                )}
                >Turn up: { display(this.props.G.turnUp) }</h2>
                {/* <p>{ this.props.G.stock.length} cards left.</p> */}
                <h2>Trick</h2>
                {
                    this.props.G.currentTrick.map(c => <span key={c.card}>
                        { display(c.card)}
                    </span>)
                }
                <h2>Hand</h2>
                <ul>
                    { this.props.G.players[this.playerID].hand
                        .sort(sortCards).map(c => 
                        <li key={c}
                            style={{ display: 'inline-block'}}
                            onClick={() => this.playCard(c) }>
                            { display(c) }
                        </li>
                    )}
                </ul>

                { 
                    this.props.ctx.phase === 'ready' ? 
                        <button onClick={() => this.props.moves.Ready()}>
                            Ready
                        </button> : null
                }

                {winner}
            </div>
        )
    }
}
