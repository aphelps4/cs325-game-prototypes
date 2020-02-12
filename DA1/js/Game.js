"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	var map = null;
	var tileset = null;
	var layer = null;
	
	var player = null;
	
	var cursors = null;
	
	//	only allow the player to move when the time is up to stop them from moving too quick
	//	can change number for different "feels" when playing
	var pause = 20;
	var moveTimer = pause;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Create a sprite at the center of the screen using the 'logo' image.
            //	bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
            // Anchor the sprite at its center, as opposed to its top-left corner.
            // so it will be truly centered.
            //	bouncy.anchor.setTo( 0.5, 0.5 );
            
            // Turn on the arcade physics engine for this sprite.
            //	game.physics.enable( bouncy, Phaser.Physics.ARCADE );
            // Make it bounce off of the world bounds.
            //	bouncy.body.collideWorldBounds = true;
            
            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            //	var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            //	var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            //	text.anchor.setTo( 0.5, 0.0 );
            
            // When you click on the sprite, you go back to the MainMenu.
            //	bouncy.inputEnabled = true;
            //	bouncy.events.onInputDown.add( function() { quitGame(); }, this );
			
			//	code for Phaser grid movement example
			map = game.add.tilemap('map', 32, 32);
			tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
			layer = map.createLayer(0)
			
			player = game.add.image(32+16, 32+16, 'car');
			player.anchor.setTo(0.5, 0.5);
			
			//	Phaser.Input.Keyboard.JustDown for when you want just one press registered
			cursors = game.input.keyboard.createCursorKeys();
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
            //	bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
			
			//	code for Phaser grid movement example
			//	Left
			if (cursors.left.isDown){
				
				//	Get the tile to the left of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(player.x - 32, player.y);
				
				//	changing the way the player is facing; could possibly change sprite if animation supports it
				player.angle = 180;
				
				//	Checking if the tile to the left is a solid wall (denoted by 2 in the cvs tilemap)
				if (tile.index === 2){
					//	Blocked, we can not move
				}
				else{
					if (moveTimer >= pause){
						player.x -= 32;
						//	player has moved so prevent them from moving again for a short while
						moveTimer = 0;
					}
				}
				
			}
			
			//	Right
			if (cursors.right.isDown){
				
				//	Get the tile to the right of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(player.x + 32, player.y);
				
				player.angle = 0;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (moveTimer >= pause){
						player.x += 32;
						moveTimer = 0;
					}
				}
				
			}
			
			//	Up
			if (cursors.up.isDown){
				
				//	Get the tile to the top of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(player.x, player.y - 32);
				
				player.angle = -90;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (moveTimer >= pause){
						player.y -= 32;
						moveTimer = 0;
					}
				}
				
			}
			
			//	Down
			if (cursors.down.isDown){
				
				//	Get the tile to the bottom of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(player.x, player.y + 32);
				
				player.angle = 90;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (moveTimer >= pause){
						player.y += 32;
						moveTimer = 0;
					}
				}
				
			}
			
			moveTimer++;
			
        }
    };
};
