"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	
	// An object for shared variables, so that them main menu can show
	// the high score if you want.
	var shared = {
		rotateToMouse : function(object, mouse){
			object.rotation = game.physics.arcade.angleToPointer(object, game.input.activePointer);
		},
		shoot : function(shooter, objectToShoot){
			var velocity = 500;
			var toShoot = game.add.sprite(shooter.x, shooter.y, objectToShoot);
			toShoot.anchor.setTo(0.5, 0.5);
			toShoot.angle = shooter.angle;
			game.physics.enable(toShoot, Phaser.Physics.ARCADE);
			toShoot.allowGravity = true;
			toShoot.body.velocity.x = Math.cos(toShoot.rotation) * velocity;
			toShoot.body.velocity.y = Math.sin(toShoot.rotation) * velocity;
			toShoot.body.gravity.y = 250;
			return toShoot;
		}
	};
	
	game.state.add( 'Boot', GameStates.makeBoot( game ) );
	game.state.add( 'Preloader', GameStates.makePreloader( game ) );
	game.state.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	game.state.add( 'Game', GameStates.makeGame( game, shared ) );

	//	Now start the Boot state.
	game.state.start('Boot');

};
