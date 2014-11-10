'use strict';

var socket = io('http://' + location.host),
  $console = $('#console');

socket.on('connect', function () {
  $('#console').append('<div class="message">Connected.</div>');
});

var printMessage = function(message) {
  var time = new Date().toISOString();
  var eventHTML = '<div class="message"><span class="time">' + time + ':</span>';
  eventHTML += '<span class="message">' + message + '</span></div>';
  $('#console').append(eventHTML);
  $console.scrollTop($console.prop('scrollHeight'));
};

socket.on('keydown', function(e) {
  var message = 'Received <b>keyDown</b> key <b>#' + e.which + '</b>, Identifier: <b>' + e.keyIdentifier + '</b>';
  printMessage(message);
});

socket.on('keyup', function(e) {
  var message = 'Received <b>keyUp</b> key <b>#' + e.which + '</b>, Identifier: <b>' + e.keyIdentifier + '</b>';
  printMessage(message);
});

socket.on('ping', function() {
  // var message = 'Ping!';
  // printMessage(message);
});
