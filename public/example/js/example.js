'use strict';

var scene,
  renderer,
  player,
  vrController;

var map = [ // 1  2  3  4  5  6  7  8  9
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
           [1, 1, 0, 0, 0, 0, 0, 1, 1, 1,], // 1
           [1, 1, 0, 0, 2, 0, 0, 0, 0, 1,], // 2
           [1, 0, 0, 0, 0, 2, 0, 0, 0, 1,], // 3
           [1, 0, 0, 2, 0, 0, 2, 0, 0, 1,], // 4
           [1, 0, 0, 0, 2, 0, 0, 0, 1, 1,], // 5
           [1, 1, 1, 0, 0, 0, 0, 1, 1, 1,], // 6
           [1, 1, 1, 0, 0, 1, 0, 0, 1, 1,], // 7
           [1, 1, 1, 1, 1, 1, 0, 0, 1, 1,], // 8
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
        ],
        mapW = map.length,
        mapH = map[0].length;

  // Constants
  var UNITSIZE = 250,
    WALLHEIGHT = UNITSIZE / 3;

// Set up the objects in the world
function setupScene() {
  var t = THREE,
    UNITSIZE = 250,
    units = mapW;

  // Geometry: floor
  var floor = new t.Mesh(
      new t.BoxGeometry(units * UNITSIZE, 10, units * UNITSIZE),
      new t.MeshLambertMaterial({ map: t.ImageUtils.loadTexture('textures/floor.jpg') })
  );
  scene.add(floor);

  // Geometry: walls
  var cube = new t.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
  var materials = [
                    new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('textures/wall-1.jpg')}),
                    new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('textures/wall-2.jpg')}),
                    new t.MeshLambertMaterial({color: 0xFBEBCD}),
                  ];
  for (var i = 0; i < mapW; i++) {
    for (var j = 0, m = map[i].length; j < m; j++) {
      if (map[i][j]) {
        var wall = new t.Mesh(cube, materials[map[i][j]-1]);
        wall.position.x = (i - units/2) * UNITSIZE;
        wall.position.y = (WALLHEIGHT/2);
        wall.position.z = (j - units/2) * UNITSIZE;
        scene.add(wall);
      }
    }
  }
}

// Setup
function init() {

  // Render three.js world
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0050);

  // Create player
  player = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0), new THREE.MeshLambertMaterial({
    color: 'white'
  }));

  // Directional light
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);

  // vr-controller setup
  vrController = new THREE.VRController({
    player: player,
    scene: scene,
    renderer: renderer,
    // Replace this with your local ip
    serverIp: '192.168.0.100'
  });

  vrController.controls.checkWallCollision = function(v) {
    var c = getMapSector(v);
    return map[c.x][c.z] > 0;
  };

  setupScene();
}

function getMapSector(v) {
  var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW/2);
  var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW/2);
  return { x: x, z: z };
}

// Render loop
function animate() {
  vrController.update(scene);
  requestAnimationFrame(animate);
}

init();
animate();
