/*
 *.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
 */

/**
 * a Card should have a 
 * Unique ID,
 * Sorting weight,
 * CSS
 * Enable/disable
 * onClick??
 */


/**
 * a Location should have
 * type “stock”, “hand”, “trick"
 * (face up, face down, etc.)
 * (size, rotation, visibility?)
 * x, y
 * stock: face down, rotate(0deg) same x,y
 * Hand: faceup, rotate (-10deg - 10deg); xy - spread horizontally
 * trick: random rotate, ascending z-index
 */

/**
 * 
 * @param {root} 
 * @param {*} cards 
 * @returns
 */
function createDeck(root, cards) {

    let deck = cards.map((c, i) => ({
        card: c,
        weight: i,
        location: null
    }))

    let locations = {
        'hand': () => {
            let handCards = deck.filter(c => c.location === 'hand')
                .sort((a, b) => a.weight - b.weight)
            handCards.forEach(({card}, i) => {
                let fromCenter = (handCards.length - 1) / 2
                let xOffset = `translateX(calc(-50% + ${((i - fromCenter) * 2)}em))`
                let yOffset = `translateY(calc(-1em + ${Math.abs(i-fromCenter) / 5}em))`
                let rotation = `rotate(${(i - fromCenter) * 5}deg)`
                let style = document.getElementById(card).style
                style.transform = `${xOffset} ${yOffset} ${rotation}`
                style.transformOrigin="center bottom"
            })
        },
        'trick-pile': () => {}
    }

    // locations should retain what cards are where:
    // or should the cards retain their location?
    // if a card enters or leaves a location, those two
    // should be re-styled for the new quantities.


    // should all animations go into a queue, and be resolved one at a time?

    /**
     * 
     * @param {string | string[]} cardOrCards 
     * @param {string} location 
     */
    function moveCard (cardOrCards, location) {
        let cards = cardOrCards
        if (typeof cardOrCards == 'string') {
            cards = [cardOrCards]
        } else if (!Array.isArray(cardOrCards)) {
            throw Error("Must be a string id or array")
        }
        // REMOVE OLD LOCATION
        cards.forEach(card => {
            let oldCard = deck.find(c => c.card === card)
            let domCard = document.getElementById(card)
            domCard.style.visibility = 'visible'
            domCard.classList.remove(oldCard.location)
            domCard.classList.add(location)
            oldCard.location = location
        })

        // arrange location
        locations.hand()
        locations["trick-pile"]()
        
    }

    function moveCards(from, to) {
        let cards = deck.filter(c => c.location === from)
        cards.forEach(card => {
            let domCard = document.getElementById(card.card)
            domCard.classList.remove(from)
            domCard.classList.add(to)
            card.location = to
        })

    }

    function resetCards(to) {
        deck.forEach(card => {
            let from = card.location
            let domCard = document.getElementById(card.card)
            if (from && domCard) domCard.classList.remove(from)
            if (domCard) domCard.classList.add(to)
            card.location = to
        })
    }

    return {
        // addLocation('location', class, type)
        // changeWeights( { 'card': newWeight, 'card2': newWeight2} )

        // placeAt('card' | ['card'], 'location') // to
        // moveCard('card' | ['card'], 'location', 'location') // from, to
        moveCard,
        // moveCards('location', 'location') // everything from, to
        moveCards,
        resetCards
    }
}

export default createDeck