function BullySocket() {
    var self = this;
    var BullyGame = require('../GameObjects/Bully/BullyGame');
    self.games = [];
    var lastGameid = 0;

    self.connect = function (socket) {
        console.log("new client connected to bully: " + socket.id);
        socket.join('lobby');
        socket.on('disconnect', function () {
            console.log("client disconnected from bully");
            removeGameWithPlayer(socket.id);
        });
        socket.on('join', function (room) {
            self.io.to(room).emit('join', socket.id + ' has joined the party');
        })
        socket.on('leave', function (room) {
            if (socket !== undefined) {
                self.io.to(room).emit('leave', socket.id + ' has left the building');
            }
            else {
                self.io.to(room).emit('leave', 'Someone has left the building');
            }
        })
        socket.on('games', function () {
            var gg = getGames();
            self.io.to(socket.id).emit('games', gg);
        });
        socket.on('private', function (data) {
            socket.to(data.socketid).emit(data.message);
        })
        socket.on('room', function (room) {
            socket.leave(socket.rooms[0]);
            socket.join(room);
        })
        socket.on('joinGame', function (gameid) {
            if (findGameWithPlayer(socket.id) == null) {
                console.log(socket.id + ' joining game: ' + gameid);
                var g = getGameById(gameid);
                if (g != null) {
                    var starting = g.addPlayer(socket.id);
                    socket.emit('joinGame', true);
                    if (starting) {
                        gameStartingNotification(g);
                    }
                    playerJoined(g);
                } else {
                    socket.emit('joinGame', false);
                }
            } else {
                socket.emit('joinGame', false);
            }
        });
        socket.on('startGame', function () {
            var g = findGameWithPlayer(socket.id);
            console.log('starting game: ' + g);
            if (g == null) {
                console.log('g was null');
            } else if (g.start()) {
                console.log(g.id + ' has started');
                gameStartingNotification(g);
            } else {
                console.log(g.id + ' game hasnt started.');
            }
        });
        socket.on('status', function () {
            notifyPlayer(socket.id);
        });
        socket.on('update', function (data) {
            console.log('an update has been send: ' + JSON.stringify(data));
        });
        socket.on('message', function (data) {
            console.log('sending: ' + data.message + ' to everyone in room: ' + data.room);
            self.io.to(data.room).emit('message', data.message);
        });
        socket.on('turn', function (card) {
            console.log('turn:' + socket.id + ' with ' + card);
            // turn update logic
            var game = findGameWithPlayer(socket.id);
            try {
                game.update(socket.id, card);
                // passed update
                socket.emit('turnOK');
                notifyPlayers(game);

            } catch (ex){
                console.log(ex);
                socket.emit('turnFail', ex.message);
            }
        });
        socket.on('newGame', function () {
            var g = new BullyGame(++lastGameid);
            console.log('created new game ' + g.id);
            g.addPlayer(socket.id);
            self.games.push(g);
            socket.join(g.id);
            socket.emit('joinGame', true);
            var gg = getGames();
            self.io.emit('games', gg);
        });
    }

    self.setup = function (io) {
        //socket setup
        self.io = io;
        io.on('connection', self.connect);
    }

    function getGameById(id) {
        for (var i = 0; i < self.games.length; i++) {
            if (self.games[i].id == id) {
                return self.games[i];
            }
        }
        return null;
    }

    function gameStartingNotification(game) {
        var p = game.getPlayers();
        for (var i = 0; i < p.length; i++) {
            var data = game.getData(p[i].id);
            console.log('sending ' + p[i].id + ' his data: ' + JSON.stringify(data));
            self.io.to(p[i].id).emit('gameStarted', data);
        }
    }

    function notifyPlayers(game){
        var p = game.getPlayers();
        for (var i = 0; i < p.length; i++) {
            var data = game.getData(p[i].id);
            console.log('sending ' + p[i].id + ' his data: ' + JSON.stringify(data));
            self.io.to(p[i].id).emit('gameUpdate', data);
        }
    }

    function notifyPlayer(pid) {
        var game = findGameWithPlayer(pid);
        var data = game.getData(pid);
        console.log('sending ' + p[i].id + ' his data: ' + JSON.stringify(data));
        self.io.to(p[i].id).emit('gameUpdate', data);
    }

    function notifyPlayerQuit(game) {
        for (var i = 0; i < game.getPlayers().length; i++) {
            self.io.to(game.getPlayers()[i].id).emit('quit');
        }
    }

    function findGameWithPlayer(id) {
        for (var i = 0; i < self.games.length; i++) {
            var players = self.games[i].getPlayers();
            for (var j = 0; j < players.length; j++) {
                if (players[j].id == id) {
                    return self.games[i];
                }
            }
        }
        return null;
    }

    function removeGameWithPlayer(id) {
        var game = findGameWithPlayer(id);
        if (game != null) {
            notifyPlayerQuit(game);
            var gid = self.games.indexOf(game);
            self.games.splice(gid, 1);
        }
    }

    function getGames() {
        var games = [];
        for (var i = 0; i < self.games.length; i++) {
            if (!self.games[i].isStarted) {
                var g = {};
                g.id = self.games[i].id;
                g.players = self.games[i].getPlayers().length;
                games.push(g);
            }
        }
        return games;
    }

    function playerJoined(game) {
        var players = game.getPlayers();
        for (var i = 0; i < players.length; i++) {
            self.io.to(players[i].id).emit('playerJoin', players.length);
        }
    }
}

module.exports = new BullySocket();