var express = require('express');
var app = express();
require('./GameObjects/General/Prototypes');

var server = app.listen(process.env.PORT || 3000);


app.use(express.static('public'));

var io = require('socket.io')(server);
var mySocket = require('./Sockets/mySocket');
var bullySocket = require('./Sockets/BullySocket');

mySocket.setup(io.of('/general'));

bullySocket.setup(io.of('/bully'));

