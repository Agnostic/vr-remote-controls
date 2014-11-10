/**
* vr-remote controller for Three.js
* Gilberto Avalos Osuna <avalosagnostic@gmail.com>
*/

'use strict';

var express = require('express'),
  http = require('http'),
  app = express(),
  fs = require('fs'),
  io = require('socket.io')({
    'transports': ['xhr-polling'],
    'polling duration': 10
  });

// Static content
app.use(express.static(__dirname + '/public'));

// Library provider
app.get('/vr-controller.js', function(req, res) {
  res.setHeader('Content-Type', 'application/javascript');

  var script = __dirname + '/client/vr-controller.js';
  var fileStream = fs.createReadStream(script);
  fileStream.pipe(res);
});

// Initialize server
var server = http.createServer(app).listen(3001);
var sockets = io.listen(server);

// Websocket events
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
