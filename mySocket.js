function socket(socket) {
    var self = this;
    self.connect = function (socket) {
        console.log("new client connected: " + socket.id);
        socket.join('lobby');
        console.log(socket.rooms);
        socket.on('disconnect', function () {
            console.log("client disconnected");
        });
        socket.on('join',function(room){
            self.io.to(room).emit('join', socket.id + ' has joined the party');
        })
        socket.on('leave', function(room){
            if(socket !== undefined){
                self.io.to(room).emit('leave', socket.id + ' has left the building');
            }
            else{
                self.io.to(room).emit('leave', 'Someone has left the building');
            }
        })
        socket.on('private', function(data){
            socket.to(data.socketid).emit(data.message);
        })
        socket.on('room', function(room){
            socket.leave(socket.rooms[0]);
            socket.join(room);
        })
        socket.on('update', function (data) {
            console.log('an update has been send: ' + JSON.stringify(data));
        });
        socket.on('message', function (data) {
            console.log('sending: ' + data.message + ' to everyone in room: ' + data.room);
            self.io.to(data.room).emit('message', data.message);
        });

    }

    self.setup = function (io) {
        //socket setup
        self.io = io;
        io.sockets.on('connection', self.connect);
    }


}

module.exports = new socket();