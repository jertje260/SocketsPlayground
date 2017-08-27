function Deck(amount, withJokers){
    var self = this;
    var enums = require('./CardEnums');
    var Card = require('./Card');
    self.cards = [];

    function init(){
        for(var i = 0; i < amount; i++){
            createDeck();
        }
    }

    function createDeck(){
        for(var i = 0; i < 52;i++){
            var type = enums.__CardTypeEnum.getType(Math.floor(i/13+1))
            var name = enums.__CardNameEnum.getName(i%13+1);
            self.cards.push(new Card(type,name))
        }
        if(withJokers){
            for(var i =0; i < 4; i++){
                self.cards.push(new Card(enums.__CardTypeEnum.properties[enums.__CardTypeEnum.None].name,enums.__CardNameEnum.properties[enums.__CardNameEnum.Joker].name));
            }
        }
    }

    self.shuffle = function(){
        self.cards.shuffle();
    }

    self.addCard = function(card){
        self.cards.push(card);
    }

    self.popCard = function(){
        return self.cards.shift();
    }
    self.peek = function(){
        return self.cards[self.cards.length-1];
    }
    init();
}

module.exports = Deck;