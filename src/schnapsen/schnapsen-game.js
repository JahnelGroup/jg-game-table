import { ActivePlayers, INVALID_MOVE, PlayerView, Stage } from 'boardgame.io/core';

const pointValues = {
    'A': 11,
    'T': 10,
    'K': 4,
    'Q': 3,
    'J': 2
}
const suits = 'HSCD'.split('')
const ranks = 'JQKTA'.split('')
const deck = ranks.flatMap(r => suits.map(s => r + s))


const nextPlayer = (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers

/**
 * @typedef {Object} G Schnapsen Game State
 * @property {*} secret information only available on the server
 * @property {*} players information only available to a given player
 * @property {string[][]} trickPiles player0 and player1's cards won
 * @property {number[]} points player0 and player1's total cummulative points
 * @property {number} claimPoints the opponents points at the time the stock is closed
 * @property {number[]} gamePoints player0 and player1's cummulative game points
 * @property {string} turnUp a duplicate reference to the turn up
 * @property {string} trump the trump suit for the hand
 * @property {*} currentTrick the current cards played to a trick
 * @property {*} moves a record of all moves.
 * @property {"0" | "1"} nextPlayer
 * @property {"0" | "1"} dealer
 * @property {*[]} games a record of all games.
 */

/**
 * Sets up the starting game state
 * @param {*} ctx 
 * @param {*} setupData
 * @returns {G}
 */
function setup(ctx, setupData) {
    const dealer = Math.round(ctx.random.Number()).toString()

    return {
        secret: {  },
        players: {
            '0': { hand: [] },
            '1': { hand: [] },
        },
        trickPiles: [[], []],
        points: [0, 0],
        claimPoints: 0,
        gamePoints: [7,7],
        turnUp: null,
        trump: null,
        currentTrick: [],
        moves: [],
        nextPlayer: null,
        dealer,
        games: []
    }
}

function Deal(G, ctx) {
    // dealer alternates    
    const dealer = G.dealer === "0" ? "1" : "0"
    const elder = dealer === "0" ? "1" : "0"
    
    // shuffle a fresh deck
    const stock = ctx.random.Shuffle([...deck])
    // deal
    const hand = [[], []]
    hand.forEach(player => player.push(...stock.splice(0, 3)))
    const turnUp = stock.shift()
    stock.push(turnUp)
    hand.forEach(player => player.push(...stock.splice(0, 2)))

    G.players['0'] = { hand: hand[0] }
    G.players['1'] = { hand: hand[1] }
    G.turnUp = turnUp
    G.trump = turnUp[1]
    G.secret = { stock }
    G.trickPiles = [[], []]
    G.points = [0, 0]
    G.claimPoints = 0
    G.currentTrick = []
    G.moves = []
    G.dealer = dealer
    G.nextPlayer = elder
}

/*
 * MOVES
 * G may be returned or mutated, but not both;
 * ctx is immutable.
 */

/**
 * 
 * @param {G} G 
 * @param {*} ctx 
 */


const Ready = (G, ctx) => {
    G.moves.push({
        player: ctx.currentPlayer,
        move: 'Ready',
    })
}

const ExchangeTrump = {
    move: function ExchangeTrump(G, ctx) {
        // Can only exchange the jack, and only when you have the lead
        if (ctx.phase === 'stockClosed' || 
            G.currentTrick.length > 0) return INVALID_MOVE

        const trumpJack = 'J'+G.trump
        const player = ctx.currentPlayer
        const hand = G.players[player].hand
        const cardIndex = hand.indexOf(trumpJack)
        if (cardIndex < 0) return INVALID_MOVE

        hand.splice(cardIndex, 1)
        hand.push(G.secret.stock.pop())
        G.secret.stock.push(trumpJack)
        G.turnUp = trumpJack
        G.moves.push({
            player,
            move: 'ExchangeTrump',
            value: trumpJack
        })
    },
    client: false
}

function CloseStock(G, ctx) {
    if (G.currentTrick.length > 0) return INVALID_MOVE
    let opponent = nextPlayer(G, ctx)
    let points = G.points[opponent]
    if (points === 0 && G.trickPiles[opponent].length > 0) {
        points = 1
    }
    G.claimPoints = points
    G.moves.push({
        player: ctx.currentPlayer,
        move: 'CloseStock'
    })
}

function DeclareMarriage(G, ctx, card) {
    // Can only declare marriages when you have the lead.
    if (G.currentTrick.length > 0) return INVALID_MOVE

    const player = ctx.currentPlayer
    const hand = G.players[player].hand
    const cardIndex = hand.indexOf(card)
    if (cardIndex < 0) return INVALID_MOVE

    // Validate Marriage
    let marriage = hand
        .filter(c => c[1] === card[1] && ['K', 'Q'].includes(c[0]))
    if (marriage.length < 2) return INVALID_MOVE

    G.moves.push({
        player: player,
        move: 'DeclareMarriage',
        value: marriage
    })
    // force next move to be play this card.
    PlayCard(G, ctx, card)
}

function PlayCard(G, ctx, card) {
    const player = ctx.currentPlayer
    const hand = G.players[player].hand
    const cardIndex = hand.indexOf(card)
    if (cardIndex < 0) return INVALID_MOVE

    if (ctx.phase === 'stockClosed' && G.currentTrick.length) {
        const validPlays = []
        const cardLed = G.currentTrick[0].card

        validPlays.push(hand.filter(c => c[1] === cardLed[1] && 
            pointValues[c[0]] > pointValues[cardLed[0]]))       // head,
        validPlays.push(hand.filter(c => c[1] === cardLed[1]))  // otherwise follow,
        validPlays.push(hand.filter(c => c[1] === ctx.trump))   // otherwise trump,
        validPlays.push(hand)  
        console.log(validPlays)                              // otherwise whatever
        if (validPlays.find(plays => plays.length &&  !plays.includes(card))) {
            return INVALID_MOVE
        }
    }
    
    hand.splice(cardIndex, 1)

    G.currentTrick.push({
        player,
        card
    })
    G.moves.push({
        player,
        move: 'PlayCard',
        value: card
    })

    // Is it the end of a trick?
    // If so, pass the turn to the winner, empty the cards
    // into the pile, and draw one for each.
    if (G.currentTrick.length === 2) {
        // sort the cards in order of suit led and trump, and take the highest.
        const suitLed = G.currentTrick[0].card[1]
        const trump = G.trump

        let cards = [
            ...G.currentTrick.filter(c => c.card[1] === suitLed)
                .sort((a, b) => pointValues[a.card[0]] - pointValues[b.card[0]]),
            ...G.currentTrick.filter(c => c.card[1] === trump)
                .sort((a, b) => pointValues[a.card[0]] - pointValues[b.card[0]])
        ]
        const winner = cards.pop().player
        G.trickPiles[winner].push(...G.currentTrick.map(c => c.card))
        G.currentTrick = []
        G.nextPlayer = winner

        // draw from stock, if open.
        if (ctx.phase === 'stockOpen' &&
                G.secret && G.secret.stock.length ) {
            G.players[winner].hand.push(G.secret.stock.shift())
            G.players[winner === "0" ? "1" : "0"].hand.push(G.secret.stock.shift())
        }
        
        ctx.events.endTurn({ next: winner })
    } else {
        ctx.events.endTurn()
    }
}

function countPoints(G, ctx) {
    ctx.playOrder.forEach(player => {
        let sum = G.trickPiles[player]
            .reduce((acc, el) => acc + pointValues[el[0]], 0)
        if (G.trickPiles[player].length) {
            let marriages = G.moves
                .filter(move => move.move === 'DeclareMarriage' &&
                    move.player === player)
                .map(move => move.value[0][1] === G.trump ? 40 : 20)
            sum += marriages
                .reduce((acc, el) => acc + el, 0)
        }
        G.points[player] = sum
    })

}

const turn = {
    onEnd: countPoints,
    order: {
        first: (G, ctx) => Number(G.nextPlayer),
        next: nextPlayer,
    }
}


export const Schnapsen = {

    name: 'schnapsen',

    setup,

    phases: {
        ready: {
            onBegin: (G, ctx) => {
                G.moves = []
                G.secret.stock = null
            },
            turn: { activePlayers: ActivePlayers.ALL_ONCE },
            moves: { Ready },
            start: true,
            endIf: (G, ctx) => G.moves.length === ctx.numPlayers,
            next: 'stockOpen',
            onEnd: Deal,
        },

        stockOpen: {
            moves: { DeclareMarriage, ExchangeTrump, PlayCard, CloseStock },
            turn,
            endIf: (G, ctx) => {
                let stock = (G.secret.stock && G.secret.stock.length <= 0)
                let closed = G.moves.find(m => m.move === 'CloseStock')
                let handover = handOver(G, ctx)
                if (handover) return ({ next: 'ready' })
                return (stock || closed )
            },
            next: 'stockClosed',
            onEnd: handWinner
        },

        stockClosed: {
            moves: { DeclareMarriage, ExchangeTrump, PlayCard },
            turn,
            endIf: (G, ctx) => handOver(G, ctx) && ({ next: 'ready' }),
            onEnd: handWinner,
            next: 'ready'
        },
    },

    playerView: PlayerView.STRIP_SECRETS,

    endIf: gameOver,

    minPlayers: 2,
    maxPlayers: 2,
}




function handOver(G, ctx) {
    const someoneHit66 = G.points.some(pp => pp >= 66) 
    const outOfCards = (ctx.phase === 'stockClosed' && Object.entries(G.players)
        .every(([key, pl]) => !pl.hand.length))        
    return someoneHit66 || outOfCards 
}

function handWinner(G, ctx) {
    const winner = [0, 1]
        .find(p => G.points[p] >= 66)
    
    if (ctx.phase === 'stockOpen') {
        if (winner !== undefined) {
            let opponentPoints = G.points[1 - winner]
            if (opponentPoints >= 33) {
                G.gamePoints[winner] -= 1
            } else if (G.trickPiles[1 - winner].length > 0) {
                G.gamePoints[winner] -= 2
            } else {
                G.gamePoints[winner] -= 3
            }
            G.games.push({
                winner,
                wonBy: '66',
                points: G.points,
                gamePoints: G.gamePoints
            })
        }
        return
    }

    const closer = G.moves
        .find(move => move.move === 'CloseStock')

    if (closer) {
        let closingPlayer = closer.player
        let opponentPoints = G.claimPoints
        if (closingPlayer == winner) {
            if (opponentPoints >= 33) {
                G.gamePoints[winner] -= 1
            } else if (opponentPoints > 0) {
                G.gamePoints[winner] -= 2
            } else {
                G.gamePoints[winner] -= 3
            }
            G.games.push({
                winner,
                wonBy: 'close',
                points: G.points,
                claimPoints: opponentPoints,
                gamePoints: G.gamePoints
            })
        } else {
            let opponent = 1 - closingPlayer
            if (opponentPoints > 0) {
                G.gamePoints[opponent] -= 2
            } else {
                G.gamePoints[opponent] -= 3
            }
            G.games.push({
                winner: opponent,
                wonBy: 'failedClose',
                points: G.points,
                claimPoints: opponentPoints,
                gamePoints: G.gamePoints
            })
        }
    } else if (winner !== undefined) {
        let opponentPoints = G.points[1 - winner]
        if (opponentPoints >= 33) {
            G.gamePoints[winner] -= 1
        } else if (G.trickPiles[1 - winner].length > 0) {
            G.gamePoints[winner] -= 2
        } else {
            G.gamePoints[winner] -= 3
        }
        G.games.push({
            winner,
            wonBy: '66',
            points: G.points,
            gamePoints: G.gamePoints
        })
    } else {
        // winner of last trick wins
        let winner = G.nextPlayer
        G.gamePoints[winner] -= 1
        G.games.push({
            winner,
            wonBy: 'lastTrick',
            gamePoints: G.gamePoints
        })
    }
}

function gameOver (G, ctx) {
    if (G.gamePoints[0] <= 0)
        return { winner: 0 }
    if (G.gamePoints[1] <= 0)
        return { winner: 1 }
}

