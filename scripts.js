import { Card, Deck, PlayerDeck, MerchantDeck, Player } from './hardback-logic.js';

// Import card information later from separate JSON file
const cards = {};

cards.letters = "aabcdeefghiijklmnoopqrstuuvwxyz";
cards.suits = [
    "Romance",
    "Adventure",
    "Mystery",
    "Horror"
];

cards.merchantCards = [];

cards.baseCards = [];
cards.baseLetters = "aeilnrst";
cards.starCards = [];
cards.starLetters = "bcdfghmopu";

let id = 0;

for (let j = 0; j < cards.baseLetters.length; j++) {
    cards.baseCards.push({
        id: id++,
        suit: "Coin",
        letter: cards.baseLetters[j]

    })
};

for (let j = 0; j < cards.starLetters.length; j++) {
    cards.starCards.push({
        id: id++,
        suit: "Star",
        letter: cards.starLetters[j]

    })
}

for (let i = 0; i < cards.suits.length; i++) {
    for (let j = 0; j < cards.letters.length; j++) {
        cards.merchantCards.push({
            id: id++,
            suit: cards.suits[i],
            letter: cards.letters[j]

        })

    }
};

const merchant = new MerchantDeck();
// merchant.populateDeck(cards.merchantCards);
// merchant.shuffleCards();
// merchant.starterCards.populateDeck(cards.starCards);
// merchant.starterCards.shuffleCards();

// const player = new Player("Player 1", 0)
// player.setMerchant = merchant
// player.deck.populateDeck(cards.baseCards)

// merchant.starterCards.giveNextCard(player.deck)
// merchant.starterCards.giveNextCard(player.deck)

// document.getElementById("noPress").addEventListener("click", (e) => { 
//     player.testReport()
// });
// document.getElementById("playerHand").addEventListener("click", (e) => { 
//     const hand = player.deck.newHand()
//     console.log(hand)
// });

// let content = (merchant.getOfferRow().map(c => c.letter).join(","));
let content = "BOOOOO"

merchant.offerRow = document.getElementById("game__offer-row")


merchant.offerRow.innerHTML = `<p>${content}</p>`