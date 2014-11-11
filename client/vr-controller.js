/**
 * @author Gilberto Avalos <avalosagnostic@gmail.com>
 * http://github.com/Agnostic
 *
 * VR Controller using FirstPersonController, StereoEffect and DeviceOrientationController
 * Autors included in plugin files.
 */

'use strict';

THREE.VRController = function(options) {
  var self = this,
    clock = new THREE.Clock(),
    port = 3001;

  self.player = options.player;
  self.moveSpeed = options.moveSpeed || 100;

  var onWindowResize = function() {
    self.stereoEffect.setSize(window.innerWidth, window.innerHeight);
  };

  var setup = function() {
    self.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2500);
    self.camera.position.y = 10;
    self.camera.position.z = 0;

    self.controls = new THREE.FirstPersonControls(options.player);
    self.controls.movementSpeed = self.moveSpeed;
    self.controls.lookVertical = false;
    self.controls.noFly = true;

    self.stereoEffect = new THREE.StereoEffect(options.renderer);
    self.stereoEffect.separation = 10;
    self.stereoEffect.setSize(window.innerWidth, window.innerHeight);

    self.vrCamera = new THREE.DeviceOrientationController(self.camera, options.renderer.domElement);
    self.vrCamera.enableManualDrag = false;
    self.vrCamera.enableManualZoom = false;
    self.vrCamera.connect();

    self.player.add(self.camera);
    options.scene.add(self.player);

    var socket = io(options.serverIp + ':' + port);
    socket.on('keydown', self.controls.onKeyDown);
    socket.on('keyup', self.controls.onKeyUp);

    socket.on('connect', function() {
      console.log('Connected to server.');
    });

    window.addEventListener('resize', onWindowResize, false);
  };

  setup();

  self.update = function(scene) {
    var delta = clock.getDelta();

    self.controls.update(delta);
    self.vrCamera.update();
    self.stereoEffect.render(scene, self.camera);
  };
};
