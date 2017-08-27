function Player(id) {
    var self = this;
    var Deck = require('./Deck');
    self.id = id;
    self.deck = new Deck(0);

    self.playCard = function (card) {
        for(var i =0; i < self.deck.cards.length; i++){
            if(self.deck.cards[i].name == card.name && self.deck.cards[i].type == card.type){
                var c = self.deck.cards[i];
                self.deck.cards.splice(i,1);
                return c;
            }
        }
        return null;
    }

    self.addCard = function (card) {
        self.deck.addCard(card);
    }

    self.getCards = function(){
        return self.deck.cards;
    }
}

module.exports = Player;