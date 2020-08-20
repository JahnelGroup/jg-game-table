import React from 'react'
import './playingcard.css'

const suits = {
    'H': '♥️',
    'S': '♠️',
    'C': '♣️',
    'D': '♦️'
}
const svgLookups = {
    'H': 'HEART-',
    'S': 'SPADE-',
    'C': 'CLUB-',
    'D': 'DIAMOND-',
    'J': '11-JACK',
    'Q': '12-QUEEN',
    'K': '13-KING',
    'T': '10',
    'A': '1',
}

function display(card) {
    return card ? <div 
    style={{
        color: 'HD'.includes(card[1]) ? 'red' : 'black'
    }}>
    { card[0] }<br/> { suits[card[1]] }
    </div> : null
}
function svg(card) {
    const [rank, suit] = card
    return 'Vector Cards (Version 3.2)/FACES (BORDERED)/STANDARD BORDERED/Single Cards (One Per FIle)' + svgLookups[suit] + svgLookups[rank] + '.svg'
}

export default function Card(props) {
    const classes = ['card', props.children, props.className].join(' ')

    const { onClick, ...attrs} = props
    return (
        <div onClick={onClick} className={classes}
            {...attrs}
            >
            {/* <img src={svg(props.children)} alt={props.children} /> */}
            {/* { display(props.children) } */}
        </div>
    )
}