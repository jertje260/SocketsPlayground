function BullyGame(id) {
    var Player = require('../General/Player');
    var Deck = require('../General/Deck');
    var enums = require('../General/CardEnums');
    var self = this;
    self.id = id;
    var players = [];
    var drawDeck;
    var disposeDeck;
    var completeDeck;
    var currentPlayer;
    var maxPlayers = 4;
    var startingCards = 7;
    var penaltyCards = 0;
    var nextColor;
    self.isStarted = false;

    self.start = function () {
        if (players.length < 2) {
            return false;
        }
        completeDeck = new Deck(1, true);
        drawDeck = completeDeck;
        currentPlayer = Math.floor(Math.random() * players.length);
        drawDeck.shuffle();
        for (var i = 0; i < startingCards; i++) {
            for (var j = 0; j < players.length; j++) {
                players[j].addCard(drawDeck.popCard());
            }
        }
        disposeDeck = new Deck(0);
        disposeDeck.addCard(drawDeck.popCard());
        self.isStarted = true;
        return true;
    }

    function nextPlayer(card) {
        var next = 1;

        if (card != undefined && card != null) {
            if (card.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Eight].name) {
                next = 2;
            }
            if (card.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.King].name ||
                card.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Seven].name) {
                next = 0;
            }
        }
        while (next > 0) {

            currentPlayer++;
            if (currentPlayer === players.length) {
                currentPlayer = 0;
            }
            next--;
        }

    }

    function reset() {

    }

    self.update = function (playerid, what) {
        if (players[currentPlayer].id != playerid) {
            throw new Error("It is not your turn.");
        }
        if (typeof what === 'object') {
            var card = players[currentPlayer].playCard(what);
            if (card == null) {
                throw new Error("You don't have that card");
            }
            else {
                var top = disposeDeck.peek();
                if (match(card, top)) {
                    disposeDeck.addCard(card);
                    if(what.color != null || what.color != undefined){
                        nextColor = what.color;
                    }else {
                        nextColor = null;
                    }
                    addPenaltyCards(card);
                    nextPlayer(card);
                    return;
                } else {
                    players[currentPlayer].addCard(card);
                    throw new Error("You cannot put this card on there.");
                }
            }
        } else if (typeof what === 'string') {
            if (what === 'draw') {
                // do extra check for empty draw deck (move all except top card & shuffle)
                if (drawDeck.cards.length == 0) {
                    fixDrawDeck();
                }
                var cardsToDraw = 1;
                var hadPenalty = false;
                if (penaltyCards > 0) {
                    cardsToDraw = penaltyCards;
                    penaltyCards = 0;
                    hadPenalty = true;
                }

                while (cardsToDraw > 0) {
                    var card = drawDeck.popCard();
                    players[currentPlayer].addCard(card);
                    cardsToDraw--;
                }
                if(!hadPenalty){
                    nextPlayer();
                }
                
            }
        }
    }

    function addPenaltyCards(card) {
        if (card.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Joker].name) {
            penaltyCards += 5;
        }
        if (card.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Two].name) {
            penaltyCards += 2;
        }
    }

    function match(newCard, oldCard) {
        if (newCard.name == oldCard.name) {
            return true;
        }
        if(nextColor != null || nextColor != undefined){
            if(newCard.type == nextColor){
                return true;
            }
            return false;
        }
        if (newCard.type == oldCard.type) {
            return true;
        }
        if (newCard.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Joker].name) {
            return true;
        }
        if (oldCard.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Joker].name &&
            newCard.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Two].name) {
            return true;
        }
        if (newCard.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Jack].name) {
            return true;
        }
        if (oldCard.name == enums.__CardNameEnum.properties[enums.__CardNameEnum.Joker].name && penaltyCards == 0) {
            return true;
        }
        return false;
    }

    function fixDrawDeck() {
        var removed = disposeDeck.cards.splice(1, disposeDeck.cards.length - 2);
        drawDeck.cards.push(removed);
        drawDeck.shuffle();
    }

    function hasPlayer(id) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == id) {
                return true;
            }
        }
        return false;
    }

    self.addPlayer = function (id) {
        if (!hasPlayer(id)) {
            var p = new Player(id);
            players.push(p);
            if (players.length == maxPlayers) {
                self.start();
                return true;
            }
        }
        return false;
    }

    self.getPlayers = function () {
        return players;
    }

    self.getData = function (playerid) {
        var data = {};
        data.players = [];
        data.topCard = disposeDeck.peek();
        data.currentPlayer = currentPlayer;
        for (var i = 0; i < players.length; i++) {
            data.players[i] = {};
            data.players[i].cardCount = players[i].getCards().length;
            if (players[i].id == playerid) {
                data.players[i].cards = players[i].getCards();
                if(i == currentPlayer && nextColor != null && nextColor != undefined){
                    data.color = nextColor;
                }
            }
        }
        return data;
    }


}

module.exports = BullyGame;