class Card {
    constructor(id, suit, letter, cost, rewardCoinsPrimary, rewardCoinsSecondary,
        rewardStarsPrimary, rewardStarsSecondary, abilitiesPrimary, abilitiesSecondary,
        scoreOnBuy) {
        this.id = id;
        this.suit = suit;
        this.letter = letter;
        this.cost = cost;
        this.rewards = "rewards";
        this.rewardCoinsPrimary = rewardCoinsPrimary;
        this.rewardCoinsSecondary = rewardCoinsSecondary;
        this.rewardStarsPrimary = rewardStarsPrimary;
        this.rewardStarsSecondary = rewardStarsSecondary;
        this.abilitiesPrimary = abilitiesPrimary;
        this.abilitiesSecondary = abilitiesSecondary;
        this.scoreOnBuy = scoreOnBuy;
        this.isInked = false;
        this.isTrashed = false;
        this.trashedByPlayerId = null;
        this.merchantBumped = false;
        this.isInDiscard = false;
        this.isWild = false;
        this.played = false;
        this.timelessClassic = false;
        this.abilityRewardCoins = 0;
        this.abilityRewardStars = 0;
        this.discardTimelessClassic = false;
        this.multiplier = 1;
        this.isFlippedFromWild = false;
    }

    setMultiplier(num) {
        this.multiplier = num;
    }

    setFlippedFromWild(truth) {
        this.isFlippedFromWild = truth;
    }

    setPlayed(truth) {
        this.played = truth
    }

    setWild(truth) {
        this.isWild = truth
    }

    setInked(truth) {
        this.isInked = truth
    }

    setDiscardTimelessClassic(truth) {
        this.discardTimelessClassic = truth
    }

    setAbilityRewardCoins(num) {
        this.abilityRewardCoins = num
    }

    setAbilityRewardStars(num) {
        this.abilityRewardStars = num
    }

    reset(){
        const {setFlippedFromWild, setPlayed, setWild, setInked, setDiscardTimelessClassic} = this
        this.setFlippedFromWild(false);
        this.setPlayed(false);
        this.setWild(false);
        this.setInked(false);
        this.setDiscardTimelessClassic(false);
        this.setMultiplier(1);
        this.setAbilityRewardCoins(0)
        this.setAbilityRewardStars(0)
    }

    trash() {
        this.isTrashed = true;
    }

    setMerchantBump(truth) {
        this.merchantBump = truth;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.hand = [];
        this.discard = [];
        this.trash = [];
        this.handSize = 0;
        this.handPosition = 0;
        this.playerId = undefined;
    }

    createCards(cardList) {
        cardList.forEach(card => {
            let cardId = card.id
            // let newCard = new Card(cardId)
            let newCard = new Card(card.id, card.suit, card.letter, card.cost)
            this.cards.push(newCard)
        });
    }

    populateDeck(cardList){
        const {hand} = this
        hand.splice(0, hand.length-1)
        // hand.splice(0, hand.length-1, cardList)
    }

    /**
     *`shuffles Deck.cards preserving hand at end of list`
     */
    shuffleCards(useDiscard = true, deck = this.cards) {
        if (useDiscard) this.cards.push.apply(this.cards, this.discard)

        // While there remain elements to shuffle
        let protectedRange = 0

        let unshuffledIndex = deck.length - 1;

        while (unshuffledIndex) {
            // Pick a remaining element outside of protected range
            let randomCard = Math.floor(Math.random() * (unshuffledIndex - protectedRange
            ));

            // And swap it with the current element
            let storage = deck[unshuffledIndex];
            deck[unshuffledIndex] = deck[randomCard];
            deck[randomCard] = storage;

            // decrement cards remaining
            unshuffledIndex--
        }
    }

    giveCard(card, deck) {
        let index = this.cards.findIndex((c) => c.id === card.id)
        this.cards.splice(index, 1);
        deck.receiveCard(card)
    }

    giveNextCard(deck) {
        const card = this.cards[0]
        this.giveCard(card, deck)
    }

    receiveCard(card) {
        this.discard.push(card)
    }

    drawCard(inked = false) {
        const card = this.cards.shift()
        if (!card) {
            this.shuffleCards
            card = this.cards.shift()
        }
        card.setInked(inked)
        this.hand.push(card)
        return card
    }

    getHand() {
        return this.hand
    }

    discardCard(card, list = this.hand, target = this.discard) {
        let index = list.findIndex((c) => c.id === card.id)
        list.splice(index, 1);
        card.reset();
        target.push(card)
    }

    trash(card) {
        const list = this.hand
        const target = this.trash

        card.trashedByPlayerId = this.playerId

        this.discardCard(card, list, target)
    }

    newHand() {
        for (let i = 0; i < this.handSize; i++) {
            this.drawCard()
        }
        return this.hand
    }

    testReportLetters(char = ",") {
        return this.cards.map(c => c.letter).join(char)
    }
}

class PlayerDeck extends Deck {
    constructor() {
        super();
        this.handSize = 5;
        this.playerId = undefined;
    }

    trashCard(card) {
        const { cards, discard } = this

        let index = discard.findIndex((i) => i.id === card.id)
        discard[index].isTrashed = true;
        discard[index].trashedByPlayerId = this.playerId;
        discard.splice(index, 1);
    }

    getCard() {
        this.handPosition++
        return this.cards[this.handPosition]
    }

    clearTimelessClassics(){
        const cards = this.deck.hand.filter(c => c.timelessClassic)
        for (let i = 0; i<cards.length; i++){
            cards[i].setDiscardTimelessClassic(true)
        }
    }

    shiftCard(card, position){
        let index = this.hand.findIndex((c) => c.id === card.id)
        this.hand.splice(index,1)
        this.hand.splice(position, 0, card)
        /*

        shiftCard(D, 1)
        indexD = [].findIndex(D) //3
         0 1 2 3 4
        [a,b,c,D,e]
        
        [].splice(indexD,1) delete 1 at poosition 3
         0 1 2 3
        [a,b,c,e] D

        [].splice(1,0,D) insert D in front of item 1
        [a,D,b,c,e]

        */

    }
}

class MerchantDeck extends Deck {
    constructor(...args) {
        super(...args)
        this.handSize = 7;
        this.gamePosition = 0;
        this.starterCards = new Deck();
    }

    setOfferRowSize(newSize) {
        this.handSize = newSize
    }

    getOfferRow() {
        this.newHand()
    }
}


class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.deck = new PlayerDeck();
        this.deck.playerId = id
        this.trashDeck = new Deck();
        this.score = 0;
        this.handCoins = 0;
        this.ability = false;
        this.inkCount = 0;
        this.removerCount = 0;
        this.handSuits = {};
    }

    handReset(){
        //reset hand stats
        this.handCoins = 0;
        Object.keys(this.handSuits).forEach( val => {
            this.handSuits[val] = 0;
        })
    }

    drawNewHand() {
        this.handReset();
        return this.deck.newHand();
    }

    shuffleHand() {
        const useDiscard = false
        this.deck.shuffleCards(useDiscard, this.deck.hand)
    }

    drawCard() {
        return this.deck.drawCard();
    }

    drawInkedCard() {
        const inked = true
        return this.deck.drawCard(inked);
    }

    setMerchant(deck) {
        this.merchant = deck
    }

    useCardAbility(card, ability, suits=this.suits) {
        const {rewardCoins, rewardStars} = ability;

        const doubleTarget = (targetCard) => {
            targetCard.setMultiplier(targetCard.multiplier + 1)
        };

        const trashFromDiscard = (targetCard) => {
            this.deck.trashCard(targetCard)
            card.abilityRewardCoins
        };

        const receiveInkOrRemover = (type) => {
            if (type === "ink") this.inkCount += 1
            if (type === "remover") this.removerCount += 1
        };

        /*
        2 coins per adventure suit
        1 star per wild
        Choose to discard any of top3
        Stars on self-Trash
        Coins on self-Trash
        Jail Card
        Flip over adjacent wild
        X stars or Coins
        */

    };

    setScore(newScore) {
        this.score = newScore
    }

    setHandCoins(newCoins) {
        this.handCoins = newCoins
    }

    buy(position) {
        const { merchant } = this
        const adjustedPosition = merchant.handPosition + position
        const card = merchant.cards[adjustedPosition]
        merchant.giveCard(card, this.deck)
    }

    testReport(log = false) {
        if (log) { console.log(this) }
        else { return this }
    }

    testReportLetters(char = ",", log = false) {
        if (log) { console.log(this.deck.testReportLetters(char)) }
        else { return this.deck.testReportLetters(char) }

    }

    wordIsValid(word) {
        if (word.length > this.deck.hand.length) return false;

        let wordTest = this.deck.hand.filter(c => {
            return c.played
        })
            .map(c => (c.isWild ? "*" : c.letter));

        for (let i = 0; i < word.length; i++) {
            if (wordTest[i] === "*") continue
            if (word[i] === wordTest[i]) continue
            return false
        };
        return true;
    }

    setCardPlayed(card, truth){
        card.setPlayed(truth)
    }

    playWord(word){
        this.deck.hand.forEach( card => {
            if (!card.played) {
                this.discardCard(card)
            }
        })
        this.setSuitsForHand();
        
    }

    setSuitsForHand(){
        const suits = this.deck.hand.reduce((suitCount, card) => {
            if (suitCount[card.suit]) { suitCount[card.suit] += 1 }
            else { suitCount[card.suit] = 1 }
            return suitCount
        }, {})
        this.handSuitDoubles = suits
    }

    receiveCoins() {
        return this.deck.hand.reduce((total, card, index) => {

            return total + (this.handSuitDoubles[card.suit] > 1
                ? card.rewardCoinsSecondary
                : card.rewardCoinsPrimary)
        }, 0)
    }

    receiveStars() {
        const handScore = this.deck.hand.reduce((total, card, index) => {

            return total + (this.handSuitDoubles[card.suit] > 1
                ? card.rewardStarsSecondary
                : card.rewardStarsPrimary)
        }, 0)
        const newScore = this.score + handScore
        this.setScore(newScore)
        return newScore
    }
}


class Board {
    constructor() {
    }
}

export { Card, Deck, PlayerDeck, MerchantDeck, Player }