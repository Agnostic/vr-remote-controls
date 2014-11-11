vr-remote-controls
===================

vr-remote-controls is a collection of THREE.js plugins to create a simple VR controller, and it works in **iOS** and **Android**.

This package includes:

 - Gyro camera
 - FPS like controller
 - Remote controller via browser *(You don't need bluetooth gamepads)*
 - Stereo camera *(Google Cardboard/Durovis Dive  support)*

### Requeriments ###
- Node.js
- Browser

How to use it?
----------
First, you need to install dependences:
`$ npm install`

Then, run the server:
`$ node app`

And then, access to:
http://localhost:3001/


Client / Plugin
-------------

To add the plugin to your game, you need to have the vr-controller server up and running.

Include the plugin to your game:

  ```html
    <script src="http://<your-local-ip:3001>/vr-controller.js"></script>
  ```

**Create a player**

  ```javascript
  var playerGeometry = new THREE.BoxGeometry(new THREE.BoxGeometry(1, 1, 0);
  var playerMaterial = new THREE.MeshLambertMaterial({
      color: 'white'
  });
  var player = new THREE.Mesh(playerGeometry, playerMaterial);
  ```

**Initialize the plugin:**

  ```javascript
  vrController = new THREE.VRController({
      player: player,
      scene: scene,
      renderer: renderer,
      // Replace this with your local ip
      serverIp: '192.x.x.x'
  });
  ```

**Add the `vrController.update` function to your animate/render loop.**

  ```javascript
  function animate() {
    vrController.update(scene);
    requestAnimationFrame(animate);
  }
  ```

And that't it, open http://localhost:3001/ in your computer to control your mobile/vr game.

> **Notes:**

> - If you have a camera, remove/comment it, vr-controller automatically creates a camera for your player and adds the stereo effect to it.
> - Check http://localhost:3001/example/ to see a working example.

### TODO

  - Add physics (you can add physics to your player manually)

### Support

Feel free to create tickets for issues or suggestions.
