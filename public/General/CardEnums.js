var CardTypeEnum = {
    None: 0,
    Hearts: 1,
    Spades: 2,
    Clubs: 3,
    Diamonds: 4,
    properties: {
        0: { name: 'None', value: 0, code: 'N' },
        1: { name: 'Hearts', value: 1, code: 'H' },
        2: { name: 'Spades', value: 2, code: 'S' },
        3: { name: 'Clubs', value: 3, code: 'C' },
        4: { name: 'Diamonds', value: 0, code: 'D' },
    },
    getType : function(number){
        for (var prop in this) {
            if (this[prop] === number) {
                return prop;
            }
        }
    }
}

var CardNameEnum = {
    Queen: 3,
    King: 2,
    Jack: 4,
    Ace: 1,
    Ten: 5,
    Nine: 6,
    Eight: 7,
    Seven: 8,
    Six: 9,
    Five: 10,
    Four: 11,
    Three: 12,
    Two: 13,
    Joker: 14,
    Back:15,
    Color: 16,
    properties: {
        1: { name: 'Queen', value: 3, code: 'Q' },
        2: { name: 'King', value: 2, code: 'K' },
        3: { name: 'Jack', value: 4, code: 'J' },
        4: { name: 'Ace', value: 1, code: 'A' },
        5: { name: 'Ten', value: 5, code: '10' },
        6: { name: 'Nine', value: 6, code: '9' },
        7: { name: 'Eight', value: 7, code: '8' },
        8: { name: 'Seven', value: 8, code: '7' },
        9: { name: 'Six', value: 9, code: '6' },
        10: { name: 'Five', value: 10, code: '5' },
        11: { name: 'Four', value: 11, code: '4' },
        12: { name: 'Three', value: 12, code: '3' },
        13: { name: 'Two', value: 13, code: '2' },
        14: { name: 'Joker', value: 14, code: 'X' },
        15: { name: 'Back', value: 15, code: '-'},
        16: { name: 'Color', value: 15, code: '*'}
    },
    getName: function (val) {
        for (var prop in this) {
            if (this[prop] === val) {
                return prop;
            }
        }
    }
}
