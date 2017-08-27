function PlayingCards(callback) {
    var self = this;
    var spriteSheet = new Image();
    var backImage = new Image();
    var colorImage = new Image();
    var loaded = false;
    var sprites = {};

    // change to enums?    
    //self.types = ['Hearts', 'Spades', 'Clubs', 'Diamonds', 'None'];
    //self.typeChars = ['H', 'S', 'C', 'D', 'N'];
    //self.cardNames = ['Queen', 'King', 'Jack', 'Ace', 'Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 'Two', 'Joker'];
    //self.cardChars = ['Q', 'K', 'J', 'A', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'X'];

    function init() {
        for(var type in CardTypeEnum){
            if(CardTypeEnum.hasOwnProperty(type) && type != 'properties'){
                sprites[type] = {};
                if(type != 'None'){
                    for(var name in CardNameEnum){
                        if(CardNameEnum.hasOwnProperty(name) && name != 'properties' && name != 'Joker' && name != 'Back'){
                            sprites[type][name] = {};
                        }
                    }
                }else {// joker & back of card
                    sprites[type][CardNameEnum.Back];
                    sprites[type][CardNameEnum.Joker];
                    sprites[type][CardNameEnum.Color];
                }
            }
        }
        
        spriteSheet.onload = sheetLoaded;
        spriteSheet.src = '../Assets/Cards/playingCards.png';
        backImage.onload = backLoaded;
        backImage.src = '../Assets/Cards/playingCardBacks.png'
        colorImage.onload = colorLoaded;
        colorImage.src = '../Assets/Cards/artboard-2-.png';

    }

    function sheetLoaded() {
        console.log('sheet image loaded.');
        var width = 140;
        var height = 190;
        for (var i = 0; i < 53; i++) {
            var type;
            var name;
            var cardNumber;
            if (i < 13) {// spades
                type = CardTypeEnum.properties[CardTypeEnum.Spades].name;
                name = CardNameEnum.properties[i+1].name;
            }
            else if (i == 13) { // joker
                type = CardTypeEnum.properties[CardTypeEnum.None].name;
                name = CardNameEnum.properties[i+1].name;
            }
            else if (i < 27) { //hearts
                type = CardTypeEnum.properties[CardTypeEnum.Hearts].name;
                name = CardNameEnum.properties[i-13].name;
            } else if (i < 40) { // diamonds
                type = CardTypeEnum.properties[CardTypeEnum.Diamonds].name;
                name = CardNameEnum.properties[i-26].name;
            } else { // clubs
                type = CardTypeEnum.properties[CardTypeEnum.Clubs].name;
                name = CardNameEnum.properties[i-39].name;
            }

            // use / & % for position

            var ypos = i % 10;
            var xpos = Math.floor(i / 10);

            sprites[type][name] = new Sprite(xpos * width, ypos * height, width, height, spriteSheet, name, type);
        }
        spriteSheet.loaded = true;
        if(backImage.loaded && colorImage.loaded){
            loaded = true;
            callback();
        }

    }

    function backLoaded(){
        var xpos = 1;
        var ypos = 3;
        var width = 140;
        var height = 190;
        var name = 'Back';
        var type = 'None';
        sprites[type][name] = new Sprite(xpos * width, ypos * height, width, height, backImage, name, type)

        backImage.loaded = true;
        if(spriteSheet.loaded && colorImage.loaded){
            loaded = true;
            callback();
        }
    }

    function colorLoaded(){
        var width = 895;
        var height = 695;
        var name = 'Color';
        var type = 'None';
        sprites[type][name] = new Sprite(0,0,width,height,colorImage,name,type);

        colorImage.loaded = true;
        if(spriteSheet.loaded && backImage.loaded){
            loaded = true;
            callback();
        }

    }
    self.getSprite = function (type,name) {

        return sprites[type][name];
    }

    init();
}