import { toSequenceExpression } from '@babel/types';
import { expect, test } from '@jest/globals';
import { Card, Deck, PlayerDeck, MerchantDeck, Player } from './hardback-logic.js'

const cards = []
    const letters = "abcdefghijklmnopqrstuvwxyz"
    for (let i = 0; i < 26; i++) {
        cards.push({
            id: i,
            suit: "Romance",
            letter: letters[i]

        })
    }

describe("Card", () => {
    test("Initializes", () => {
        const card = new Card();
        expect(card).toBeTruthy()
    })

    test("Has id when passed integer as only argument", () => {
        const card = new Card(1)
        expect(card.id).toStrictEqual(1)
    })
})

describe("Deck", () => {

    test("Initializes empty", () => {
        const deck = new Deck();
        expect(deck.cards.length).toStrictEqual(0)
    })

    test(".createCards() creates creates card objects", () => {
        const deck = new Deck();
        deck.createCards(cards);
        expect(deck.cards.length).toStrictEqual(cards.length)
    })

    test(".shuffleCards() randomizes card order", () => {    

        const deck = new Deck();             
        deck.createCards(cards);
        let str1 = deck.cards.map(c => c.letter).join('')
        deck.shuffleCards();
        let str2 = deck.cards.map(c => c.letter).join('')
        deck.shuffleCards();
        let str3 = deck.cards.map(c => c.letter).join('')

        const truthTest = str1 !== str2 || str1 != str3
        expect(str1).not.toBe(str2)
    })

    test(".shuffleCards() moves cards from discard to deck.cards", () => {
        const deck = new Deck();
        deck.discard = [4]
        deck.cards = [1,2,3]
        deck.shuffleCards()
        const truth1st = deck.cards.includes(4)
        expect(truth1st).toBe(true)
    })
    
    test(".shuffleCards() removes all cards from .discard", () => {
        const deck = new Deck();
        deck.discard = [4]
        deck.cards = [1,2,3]
        deck.shuffleCards()
        const truth2nd = deck.discard.legth === 0
        expect(truth2nd).not.toBe(true)
    })

    test(".giveCard() removes card from deck", () => {
        const deck1 = new Deck()
        const deck2 = new Deck()
        deck1.createCards(cards)

        let cardToTransfer = deck1.cards[0]
        deck1.giveCard(cardToTransfer, deck2)
        let cardToCompare = deck1.cards[0]

        let truthTest = cardToTransfer.id === cardToCompare.id
        expect(truthTest).toBe(false)
    })

    test(".receiveCard() adds transferred card to deck", () => {
        const deck1 = new Deck()
        deck1.createCards(cards)
        let cardToTransfer = deck1.cards[0]
        const deck2 = new Deck()
        deck1.giveCard(cardToTransfer, deck2)

        let truthTest = deck2.discard[0].id === cardToTransfer.id
        expect(truthTest).toBe(true)
    })

    test("discard() removes card from .hand", () => {
        const deck = new Deck();
        deck.createCards(cards);
        deck.drawCard();

        const card = deck.hand[0]
        deck.discardCard(card)
        expect(deck.hand.findIndex((c) => c.id === card.id)).toBe(-1)
    })
})

describe("PlayerDeck", () => {
    test("trashing card removes it from player discard", ()=>{
        const jeff = new Player();
        jeff.deck.createCards(cards);
        jeff.drawNewHand()
        jeff.deck.discard = jeff.deck.hand.splice(0,jeff.deck.hand.length-1)

        let card1 = jeff.deck.discard[0]
        
        // console.log("discard:",jeff.deck.discard.length, "\n", jeff.deck.cards.length)
        jeff.deck.trashCard(card1)

        expect(jeff.deck.discard[0].id).not.toBe(card1.id)
    })

    test(".getHand() returns a hand", () => {
        const playerDeck = new PlayerDeck();
        playerDeck.createCards(cards);
        playerDeck.newHand();
        let hand = playerDeck.getHand()
        expect(hand).toBeTruthy()
    })

    test(".getCard() encriments handPosition", () => {
        const playerDeck = new PlayerDeck()
        playerDeck.createCards(cards);
        let pos1 = playerDeck.handPosition
        playerDeck.getCard()
        let pos2 = playerDeck.handPosition
        expect(pos1).not.toBe(pos2)
    })
})

describe("Player", () => {
    test(".drawCard() adds card to hand", () => {
        const jeff = new Player("Jeff", 0)
        jeff.deck.createCards(cards)
        const handLen = jeff.deck.hand.length
        jeff.drawCard()
        expect(handLen < jeff.deck.hand.length).toBe(true)
    })

    test(".drawInkedCard() adds inked card to hand", () => {
        const jeff = new Player("Jeff", 0);
        jeff.deck.createCards(cards);

        const card = jeff.drawInkedCard();

        const truthTest = card.isInked;
        expect(truthTest).toBe(true);
    })

    test("playedWord returns false when hand.length > word", () => {
        const jeff = new Player();
        expect(jeff.wordIsValid("a")).toBe(false)
    })

    test("shuffleHand randomizes hand", () => {
        const jeff = new Player();
        jeff.deck.hand = [1,2,3,4,5]
        const str1 = jeff.deck.hand.join("")
        jeff.shuffleHand()
        const str2 = jeff.deck.hand.join("")
        jeff.shuffleHand()
        const str3 = jeff.deck.hand.join("")
        const truthTest = str1 !== str2 || str1 !== str3
        expect(truthTest).toBe(true)
    })

})

describe("playerDeck.wordIsValid()", () => {
    test("played word is longer than hand.length returns false", () => {
        const jeff = new Player();
        jeff.deck.createCards(cards)
        jeff.deck.newHand()
    
        let truthTest = jeff.wordIsValid("a")
        expect(truthTest).toBe(false)
    })
    
    test("matching cards in matching order to be true", () => {
        const jeff = new Player();
        const jeffCards = "cares".split("").map((c, id) => {
            const card = new Card(id, 'null', c, 0)
            card.setPlayed(true)
            return card
        })
        jeff.deck.cards = jeffCards
        jeff.deck.newHand()
        const truthTest = jeff.wordIsValid("cares")
        expect(truthTest).toBe(true)
    })

    test("word with wild expect toBe true", () => {
        const jeff = new Player();
        const jeffCards = "cates".split("").map((c, id) => {
            const card = new Card(id, 'null', c, 0)
            card.setPlayed(true)
            if (c === "t") card.setWild(true)
            return card
        })
        jeff.deck.cards = jeffCards
        // console.log(jeff.testReportLetters())
        jeff.deck.newHand()
        const truthTest = jeff.wordIsValid("cares")
        expect(truthTest).toBe(true)
    }) 

    test("shiftCard keeps deck.length the same", ()=>{
        const deck = new PlayerDeck()
        deck.hand = "abcDe".split("").map((c, id) => {
            const card = new Card(id, 'null', c, 0)
            return card
        })
        const str1 = deck.hand.map(c => c.letter).join("")
        const cardIndex = deck.hand.findIndex(c => c.letter === "D")
        const card = deck.hand[cardIndex]

        deck.shiftCard(card, 1)
        const str2 = deck.hand.map(c => c.letter).join("")
        expect(str1.length).toEqual(str2.length)
    })

    test("shiftCard moves card within array", ()=>{
        const deck = new PlayerDeck()
        deck.hand = "abcDe".split("").map((c, id) => {
            const card = new Card(id, 'null', c, 0)
            return card
        })
        const str1 = deck.hand.map(c => c.letter).join("")
        const cardIndex = deck.hand.findIndex(c => c.letter === "D")
        const card = deck.hand[cardIndex]

        deck.shiftCard(card, 1)
        const str2 = deck.hand.map(c => c.letter).join("")
        const truthTest = str2[1] === "D" && str1[1] !== "D"
        expect(truthTest).toBe(true)
    }) 
})

describe("Player Score", () => {
    const scoreCards = [
        new Card(0, "spades", "a", 5, 1, 5, 1, 5, [], []),
        new Card(1, "hearts", "b", 5, 1, 5, 1, 5, [], []),
        new Card(2, "clubs", "c", 5, 1, 5, 1, 5, [], []),
        new Card(3, "duces", "d", 5, 1, 5, 1, 5, [], []),
        new Card(4, "spirals", "e", 5, 1, 5, 1, 5, [], []),
        new Card(5, "forks", "f", 5, 1, 5, 1, 5, [], []),
    ]
    
    test("hand score with less than 2 suits returns primary rewards", () => {
        const jeff = new Player();
        jeff.deck.hand = scoreCards.slice(0,scoreCards.length);
        jeff.setSuitsForHand()
        let score1 = jeff.deck.hand.map(c=>c.rewardCoinsPrimary).reduce((acc, cur) => acc + cur);
        let score2 = jeff.receiveStars()
        expect(score1).toEqual(score2)
    })

    test("hand score with more than 2 suits returns secondary rewards", () => {
        const jeff = new Player();
        jeff.deck.hand = [scoreCards[0], scoreCards[0]];
        jeff.setSuitsForHand()
        let score1 = jeff.deck.hand.map(c=>c.rewardCoinsSecondary).reduce((acc, cur) => acc + cur);
        let score2 = jeff.receiveStars()
        expect(score1).toEqual(score2)
    })
})

describe("Merchant", () => {
    // test(".drawCard() adds card to hand", () => {
    //     const Merchant = new MerchantDeck()
    //     Merchant.createCards(cards)
        
    //     const offerRow = Merchant.getOfferRow().map(c => c.letter).join("")
    //     const MerchantTest = Merchant.cards.slice(Merchant.handPosition, Merchant.handSize).map(c => c.letter).join("")
    //     expect(offerRow).toEqual(MerchantTest)
    // })

})