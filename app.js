'use strict';

var express = require('express');
var http = require('http');
var app = express();
var io = require('socket.io')({
  'transports': ['xhr-polling'],
  'polling duration': 10
});

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app).listen(8080);
var sockets = io.listen(server);

sockets.on('connection', function(socket) {

  socket.on('keydown', function(data) {
    socket.broadcast.emit('keydown', data);
  });

  socket.on('keyup', function(data) {
    socket.broadcast.emit('keyup', data);
  });

  var ping = function() {
    setTimeout(function() {
      socket.emit('ping');
      ping();
    }, 1000);
  };
  ping();

});
