/**
* vr-remote controller for Three.js
* Gilberto Avalos Osuna <avalosagnostic@gmail.com>
*/

'use strict';

var express = require('express'),
  port = 3001,
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
  var scripts = '',
    files = [
      '/node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
      '/client/device-orientation-controller.js',
      '/client/stereo-effect.js',
      '/client/first-person-controller.js',
      '/client/vr-controller.js'
    ];

  files.forEach(function(file) {
    scripts += fs.readFileSync(__dirname + file);
  });

  res.setHeader('Content-Type', 'application/javascript');
  res.end(scripts);
});

// Initialize server
var server = http.createServer(app).listen(port);
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

if (server._connectionKey) {
  console.log(':: vr-remote controller is up and running ::');
  console.log(':: Access to: http://127.0.0.1:' + port + '/');
}
