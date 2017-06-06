var express = require('express');
var app = express();

var server = app.listen(process.env.PORT || 3000);


app.use(express.static('public'));

var io = require('socket.io')(server);
var mySocket = require('./mySocket');

mySocket.setup(io);

