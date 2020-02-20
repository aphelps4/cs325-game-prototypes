"use strict";

GameStates.makeFloor2 = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	
	var player = null;
	var walkspeed = 3;
	
	var floor1 = null;
	var ground = null;
	var layer = null;
	var portal = null;
	var upPrompt = null;
	
	var cursors = null;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            text.anchor.setTo( 0.5, 0.0 );
			
			//	Environment
			floor1 = game.add.tilemap('floor1', 100, 100);
			ground = floor1.addTilesetImage('ground', null, 100, 100);
			layer = floor1.createLayer(0);
			floor1.setCollision(1, true);
			layer.resizeWorld();
			portal = game.add.sprite(1250, 300, 'portal');
			portal.anchor.setTo(0.5, 0.0);
			upPrompt = game.add.sprite(portal.x, portal.y - 50, 'upArrowPrompt');
			upPrompt.anchor.setTo(0.5, 0.5);
			upPrompt.visible = false;
			
			//	Creates the player
			player = game.add.sprite(40, 430, 'MC', 0);
			player.animations.add('still', [0]);
			player.animations.add('leftright', [1,2,3,0], 5, true);
			player.anchor.setTo(0.5, 0.5);
			
			//	Physics for player
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.gravity.y = 100;
			player.body.collideWorldBounds = true;
			
			game.camera.follow(player);
			
			//	Input
			cursors = game.input.keyboard.createCursorKeys();
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
			
			//	Do not let player fall past the floor tiles
			game.physics.arcade.collide(player, layer);
			
			//	Movement input
			if (cursors.left.isDown){
				//	Left has been pressed, make player move and update animation
				if (player.scale.x > 0){
					//	When scale is greater than 0, it is original direction which was right
					//	Multiply by -1 to flip to left
					player.scale.x *= -1;
				}
				player.play('leftright');
				player.x -= walkspeed;
			}
			else if (cursors.right.isDown){
				//	Right has been pressed, make player move and update animation
				if (player.scale.x < 0){
					//	When scale is less than 0, it is opposite of original direction
					//	Multiply by -1 to flip to right
					player.scale.x *= -1;
				}
				player.play('leftright');
				player.x += walkspeed;
			}
			else if (cursors.up.isDown){
				//	Up has been pressed, make the player jump and update animation
				//	Might want to disable the ability for left and right animation to trigger (but maybe not movement)
			}
			else{
				//	No (relevant) buttons are being pressed so reset animation to player staying still
				player.play('still');
			}
			
			if (player.overlap(portal)){
				upPrompt.visible = true;
				if (cursors.up.isDown){
					//	Player hit prompt to move to next floor
					game.state.start('Floor3');
				}
			}
			else{
				upPrompt.visible = false;
			}
        }
    };
};
