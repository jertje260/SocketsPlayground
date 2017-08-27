// TODO use of socket io namespaces
var socket;
var loop;
var cards;
var ctx, canvas;
var t = 1;
var n = 1;
var gameData;
var you;
var playerCount = 1;
var lastLocation = {};
var jack;


function init() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    resize();
    socket = io('/bully');
    initSockets();
    initListeners();
    cards = new PlayingCards(function () {
        loop = new Gameloop(update, draw);
        loop.start();
    });
}


var inputs = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


function update(delta) { // delta not needed, only if doing high pace games
    while (inputs.length > 0) {
        var i = inputs.shift();
        switch (i.type) {
            case 'gameUpdate': {
                gameData = i.data;
                if (you === undefined) {
                    for (var x = 0; x < gameData.players.length; x++) {
                        if (gameData.players[x].cards !== undefined) {
                            you = x;
                        }
                    }
                }
                break;
            }
            case 'location': {
                lastLocation = i.data;
                break;
            }
            case 'click': {
                clickUpdate(i.data);
                break;
            }
            default:
                break;
        }
    }
}

function clickUpdate(click) {
    if (jack != null && jack != undefined) {
        // check color clicked;
        var color = colorClicked(click);
        if (color != null && color != undefined) {
            jack.color = color;
            socket.emit('turn', jack);
            jack = null;
            return;
        }

    }
    // check if click is on a card, if so play card.
    var card = getCardFromClick(click);
    if (card != null) {
        console.log(card.name + ":" + card.type);
        if (card.name == "Jack") {
            jack = card;
        } else {
            socket.emit('turn', card);
        }
    }
    else {
        if (wasClickedOnDrawDeck(click)) {
            console.log('drawCard');
            socket.emit('turn', 'draw');
        }
    }
}

function colorClicked(click) {
    var centerx = canvas.width / 2;
    var centery = canvas.height / 2;
    // 4 types, top left, top right, bottom left, bottom right
    if (click.x > centerx - 50 && click.x < centerx && click.y > centery - 50 && click.y < centery) {// top left
        return "Hearts";
    }
    if (click.x > centerx && click.x < centerx + 50 && click.y > centery - 50 && click.y < centery) {// top right
        return "Spades";
    }
    if (click.x > centerx - 50 && click.x < centerx && click.y > centery && click.y < centery + 50) {// bottom left
        return "Clubs";
    }
    if (click.x > centerx && click.x < centerx + 50 && click.y > centery && click.y < centery + 50) {// bottom right
        return "Diamonds";
    }
    return null;
}

function wasClickedOnDrawDeck(click) {
    var centerx = canvas.width / 2;
    var centery = canvas.height / 2;
    return onCard(centerx + 10, centery - 40, true, click.x, click.y);
}

function getCardFromClick(click) {
    var xStart = canvas.width / 2 - (60 + gameData.players[you].cards.length * 20) / 2;
    var yStart = canvas.height - 90;
    for (var i = 0; i < gameData.players[you].cards.length; i++) {
        if (onCard(xStart + i * 20, yStart, gameData.players[you].cards.length == i + 1, click.x, click.y)) {
            return gameData.players[you].cards[i];
        }
    }
    return null;
}

function draw(delta) { // delta not needed, only if doing high pace games
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    if (gameData !== undefined) {
        drawYourCards();
        drawOtherCards();
        drawBoardCards();
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '20px helvetica';
        var yStart = canvas.height / 2 - 20;
        ctx.textAlign = 'center';
        if (playerCount > 1) {
            yStart -= 10;
            ctx.fillText("Click to start the game", canvas.width / 2, yStart + 40);
        }
        ctx.fillText("Waiting on other players", canvas.width / 2, yStart);
        ctx.fillText("Currently there are " + playerCount + " players in this game.", canvas.width / 2, yStart + 20);
    }
}

function drawBoard() {
    ctx.fillStyle = '#277714';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawYourCards() {
    var xStart = canvas.width / 2 - (60 + gameData.players[you].cards.length * 20) / 2;
    var yStart = canvas.height - 90;
    for (var i = 0; i < gameData.players[you].cards.length; i++) {
        var c = gameData.players[you].cards[i];
        var sprite = cards.getSprite(c.type, c.name);
        var yOffset = 0;
        if (onCard(xStart + i * 20, yStart, gameData.players[you].cards.length == i + 1, lastLocation.x, lastLocation.y)) {
            yOffset = -20;
        }
        if (sprite !== undefined || sprite !== null) {
            ctx.drawImage(sprite.canvas, xStart + i * 20, yStart + yOffset, 60, 80);
        }
    }

    // draw requested color
    if (gameData.color != null && gameData.color != undefined) {
        var sprite = cards.getSprite('None', 'Color');
        var width = 895;
        var height = 695;
        switch (gameData.color) {
            case "Diamonds": { // bottom right
                var sWidth = 895 - 550;
                var sHeigth = 695 - 370;
                ctx.drawImage(sprite.canvas, 550, 370, sWidth, sHeigth, canvas.width / 2 - 25, canvas.height / 4 * 3 - 25, 50, 70);
                break;
            }
            case "Spades": {// top right
                var sWidth = 895 - 550;
                var sHeigth = 695 - 310;
                ctx.drawImage(sprite.canvas, 550, 0, sWidth, sHeigth, canvas.width / 2 - 25, canvas.height / 4 * 3 - 25, 50, 70);
                break;
            }
            case "Hearts": { // top left
                var sWidth = 310;
                var sHeigth = 310;
                ctx.drawImage(sprite.canvas, 0, 0, sWidth, sHeigth, canvas.width / 2 - 25, canvas.height / 4 * 3 - 25, 50, 70);
                break;
            }
            case "Clubs": { // bottom left
                var sWidth = 310;
                var sHeigth = 695 - 400;
                ctx.drawImage(sprite.canvas, 0, 400, sWidth, sHeigth, canvas.width / 2 - 25, canvas.height / 4 * 3 - 25, 50, 70);
                break;
            }
            default: break;
        }
    }
}

function drawOtherCards() {

}

function onCard(xCard, yCard, lastCard, compareX, compareY) {

    if (!compareX || !compareY) {
        return false;
    }
    var width = 20;
    if (lastCard) {
        width = 60;
    }
    return compareX > xCard && compareX < xCard + width && compareY > yCard && compareY < yCard + 80;
}

function drawBoardCards() {
    var centerx = canvas.width / 2;
    var centery = canvas.height / 2;

    if (jack != null && jack != undefined) {
        // draw color chooser
        var chooser = cards.getSprite('None', 'Color')
        ctx.fillText("Pick your card color", centerx, centery - 70);
        ctx.drawImage(chooser.canvas, centerx - 50, centery - 50, 100, 100);
    } else {
        //draw top card
        var topCard = gameData.topCard;
        var topSprite = cards.getSprite(topCard.type, topCard.name);
        ctx.drawImage(topSprite.canvas, centerx - 70, centery - 40, 60, 80);
        // draw draw deck card
        var backSprite = cards.getSprite('None', 'Back');
        ctx.drawImage(backSprite.canvas, centerx + 10, centery - 40, 60, 80);
    }
}


function initSockets() {
    socket.on('message', messageRecieved);
    socket.on('turn', turnUpdate);
    socket.on('turnFail', turnFail);
    socket.on('turnOk', turnOk);
    socket.on('gameStarted', gameStarted);
    socket.on('gameUpdate', gameUpdate);
    socket.on('games', viewGames);
    socket.on('joinGame', joinGame);
    socket.on('playerJoin', playerJoin);
    socket.on('quit', gameQuit);
    socket.emit('games');
}

function gameQuit() {
    canvas.removeEventListener('mousemove', mouseMove);
    canvas.removeEventListener('touchmove', touchMove);
    canvas.removeEventListener('click', click);

}

function gameStarted(data) {
    canvas.removeEventListener("click", startGame);
    console.log(data);
    var input = {};
    input.type = 'gameUpdate';
    input.data = data;
    inputs.push(input);
    addEventListeners();
}

function addEventListeners() {
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('touchmove', touchMove);
    canvas.addEventListener('click', click);
}

function click(event) {
    var input = {};
    input.type = 'click';
    input.data = {};
    input.data.x = event.clientX;
    input.data.y = event.clientY;
    inputs.push(input);
}

function messageRecieved(message) {

}

function playerJoin(amount) {
    playerCount = amount;
    console.log(amount);
    if (amount > 1) {
        canvas.addEventListener('click', startGame);
    }
}

function mouseMove(event) {
    event.preventDefault();
    event.stopPropagation();
    move(event.clientX, event.clientY);
}

function touchMove(event) {
    event.preventDefault();
    event.stopPropagation();
    var touch = event.changedTouches[0];
    move(touch.pageX, touch.pageY);
}

function move(x, y) {
    //console.log(x + ":" + y);
    var input = {};
    input.type = 'location';
    input.data = {};
    input.data.x = parseInt(x);
    input.data.y = parseInt(y);
    inputs.push(input);
}

function turnUpdate(data) {

}

function turnFail(message) {
    alert(message);
}

function turnOk(message) {

}

function joinGame(joined) {
    if (joined) {
        document.getElementById('gameWrapper').style.display = 'none';
        canvas.style.display = 'block';
    } else {
        alert('The game was not found, or you are already in a game.');
    }
}

function viewGames(data) {
    var ul = document.getElementById("games");
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.lastChild);
    }
    for (var i = 0; i < data.length; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode("Game " + data[i].id + " - Players: " + data[i].players));
        li.setAttribute("id", data[i].id);
        ul.appendChild(li);
    }

}

function gameUpdate(data) {
    console.log(data);
    var input = {};
    input.type = 'gameUpdate';
    input.data = data;
    inputs.push(input);
}

function sendTurn(update) {
    socket.emit('turn', update);
}

function sendMessage(message) {
    socket.emit('message', message);
}

function newGame() {
    socket.emit('newGame');
}

function initListeners() {
    var ul = document.getElementById("games");
    ul.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.nodeName == 'LI') {

            joinGameById(event.target.id);
        }
        console.log(event.target.id);
        console.log(event.target.nodeName);
    })
}

function joinGameById(id) {
    socket.emit('joinGame', id);
}

function startGame() {
    socket.emit('startGame');
}

document.onresize = resize;

//socket.emit('room', 'lobby');
init();