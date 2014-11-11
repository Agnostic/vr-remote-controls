'use strict';

var socket = io(location.host),
  $console = $('#console'),
  connected = false,

// 3d stuff
  $canvasContainer = $('.canvas-container'),
  moveX = 0,
  moveY = 0,
  mesh,
  camera,
  scene,
  renderer;

var printMessage = function(message) {
  var time = new Date().toISOString();
  var eventHTML = '<div class="message"><span class="time">' + time + ':</span>';
  eventHTML += '<span class="message">' + message + '</span></div>';
  $('#console').append(eventHTML);
  $console.scrollTop($console.prop('scrollHeight'));
};

socket.on('connect', function () {
  printMessage('Connected');
  connected = true;
});

socket.on('disconnect', function () {
  printMessage('Disconnected');
  connected = false;
});

window.addEventListener('keydown', function(e) {
  if (!connected) {
   return;
  }

  var message = 'Sending key <b>#' + e.which + '</b>, Identifier: <b>' + e.keyIdentifier + '</b>';
  printMessage(message);

  if (e.which === 38 || e.which === 87) { // Up & W
    moveX = -0.05;
  } else if (e.which === 40 || e.which === 83) { // Down & S
    moveX = 0.05;
  } else if (e.which === 37 || e.which === 65) { // Left & A
    moveY = -0.05;
  } else if (e.which === 39 || e.which === 68) { // Right & D
    moveY = 0.05;
  } else {
    var hexColor = ('00000' + (Math.random()*16777216<<0).toString(16)).substr(-6);
    mesh.material.color.setHex('0x' + hexColor);
  }

  socket.emit('keydown', { which: e.which, keyCode: e.keyCode, keyIdentifier: e.keyIdentifier });
}, false);

window.addEventListener('keyup', function(e) {
  if (!connected) {
   return;
  }

  if (e.which === 38 ||
      e.which === 87 ||
      e.which === 40 ||
      e.which === 83) {
    moveX = 0;
  }

  if (e.which === 37 ||
      e.which === 65 ||
      e.which === 39 ||
      e.which === 68) {
    moveY = 0;
  }

  socket.emit('keyup', { which: e.which, keyCode: e.keyCode, keyIdentifier: e.keyIdentifier });
}, false);

// 3d
var init = function() {
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xFFFFFF);
  renderer.setSize($canvasContainer.innerWidth(), $canvasContainer.innerHeight());
  $('.canvas-container').append(renderer.domElement);

  camera = new THREE.PerspectiveCamera(70, $canvasContainer.innerWidth() / $canvasContainer.innerHeight(), 1, 1000);
  camera.position.z = 400;

  scene = new THREE.Scene();

  var directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  var geometry = new THREE.BoxGeometry(300, 300, 300);

  var texture = THREE.ImageUtils.loadTexture('textures/crate.gif');
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.SmoothShading }); //new THREE.MeshBasicMaterial({ map: texture });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  window.addEventListener('resize', onWindowResize, false );
};

var onWindowResize = function() {
  camera.aspect = $canvasContainer.innerWidth() / $canvasContainer.innerHeight();
  camera.updateProjectionMatrix();
  renderer.setSize($canvasContainer.innerWidth(), $canvasContainer.innerHeight());
};

var animate = function() {
  requestAnimationFrame(animate);
  mesh.rotation.x += moveX;
  mesh.rotation.y += moveY;
  renderer.render(scene, camera);
};

init();
animate();
