/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 *
 * Modified from default:
 * - Added this.clickMove, which differentiates between mouse-looking and
 *   click-to-move.
 * - Changed camera movement in this.update() to respect wall collisions
 * - Changed this.update() to use this.noFly to disallow going up/down with R/F
 *
 * Changes by Gilberto Avalos (agnostic)
 * - Removed camera controls
 * - Changed strafing with object rotation
 */

THREE.FirstPersonControls = function ( object, domElement ) {

  var self = this;
  this.object = object;
  this.target = new THREE.Vector3( 0, 0, 0 );

  this.domElement = ( domElement !== undefined ) ? domElement : document;

  this.movementSpeed = 1.0;
  this.lookSpeed = 0.005;

  this.noFly = false;
  this.lookVertical = true;
  this.autoForward = false;
  // this.invertVertical = false;

  this.activeLook = true;
  this.clickMove = false;

  this.heightSpeed = false;
  this.heightCoef = 1.0;
  this.heightMin = 0.0;

  this.autoSpeedFactor = 0.0;

  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.freeze = false;

  if ( this.domElement === document ) {

    this.viewHalfX = window.innerWidth / 2;
    this.viewHalfY = window.innerHeight / 2;

  } else {

    this.viewHalfX = this.domElement.offsetWidth / 2;
    this.viewHalfY = this.domElement.offsetHeight / 2;
    this.domElement.setAttribute( 'tabindex', -1 );

  }

  self.onKeyDown = function ( event ) {
    switch( event.keyCode ) {

      case 38: /*up*/
      case 87: /*W*/ self.moveForward = true; break;

      case 37: /*left*/
      case 65: /*A*/ self.moveLeft = true; break;

      case 40: /*down*/
      case 83: /*S*/ self.moveBackward = true; break;

      case 39: /*right*/
      case 68: /*D*/ self.moveRight = true; break;

      case 82: /*R*/ self.moveUp = true; break;
      case 70: /*F*/ self.moveDown = true; break;

      case 81: /*Q*/ self.freeze = !self.freeze; break;

    }
  };

  this.onKeyUp = function ( event ) {
    switch( event.keyCode ) {

      case 38: /*up*/
      case 87: /*W*/ self.moveForward = false; break;

      case 37: /*left*/
      case 65: /*A*/ self.moveLeft = false; break;

      case 40: /*down*/
      case 83: /*S*/ self.moveBackward = false; break;

      case 39: /*right*/
      case 68: /*D*/ self.moveRight = false; break;

      case 82: /*R*/ self.moveUp = false; break;
      case 70: /*F*/ self.moveDown = false; break;

    }

  };

  this.update = function( delta ) {
    var actualMoveSpeed = 0,
      rotateAngle = 0.05;

    if ( this.freeze ) {

      return;

    } else {

      if ( this.heightSpeed ) {

        var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
        var heightDelta = y - this.heightMin;

        this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

      } else {

        this.autoSpeedFactor = 0.0;

      }

      actualMoveSpeed = delta * this.movementSpeed;

      if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) {
        this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
        if (checkWallCollision(this.object.position)) {
          this.object.translateZ( actualMoveSpeed + this.autoSpeedFactor );
        }
      }
      if ( this.moveBackward ) {
        this.object.translateZ( actualMoveSpeed );
        if (checkWallCollision(this.object.position)) {
          this.object.translateZ( - actualMoveSpeed );
        }
      }

      if ( this.moveLeft ) {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(rotateAngle);
        this.object.matrix.multiply(rotationMatrix);
        this.object.setRotationFromMatrix(this.object.matrix);
      }

      if ( this.moveRight ) {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(-rotateAngle);
        this.object.matrix.multiply(rotationMatrix);
        this.object.setRotationFromMatrix(this.object.matrix);
      }

      if (!this.noFly) {
        if ( this.moveUp ) {
          this.object.translateY( actualMoveSpeed );
          if (checkWallCollision(this.object.position)) {
            this.object.translateY( - actualMoveSpeed );
          }
        }
        if ( this.moveDown ) {
          this.object.translateY( - actualMoveSpeed );
          if (checkWallCollision(this.object.position)) {
            this.object.translateY( actualMoveSpeed );
          }
        }
      }
    }

  };


  this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
  this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
  this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

  function bind( scope, fn ) {

    return function () {

      fn.apply( scope, arguments );

    };

  };

};
