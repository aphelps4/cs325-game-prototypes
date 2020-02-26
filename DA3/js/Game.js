"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	
	var background = null;
	
	var cannon = null;
	var shoot = null;
	var beds = null;
    
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
            bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
			//	Make the bouncy object invisible for now and delete later
			bouncy.visible = false;
            // Anchor the sprite at its center, as opposed to its top-left corner.
            // so it will be truly centered.
            bouncy.anchor.setTo( 0.5, 0.5 );
            
            // Turn on the arcade physics engine for this sprite.
            //game.physics.enable( bouncy, Phaser.Physics.ARCADE );
            // Make it bounce off of the world bounds.
            //bouncy.body.collideWorldBounds = true;
            
            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            text.anchor.setTo( 0.5, 0.0 );
            
            // When you click on the sprite, you go back to the MainMenu.
            bouncy.inputEnabled = true;
            bouncy.events.onInputDown.add( function() { quitGame(); }, this );
			
			background = game.add.sprite(0, 0, 'cafeBackground');
			
			cannon = game.add.sprite(60, 540, 'cannon');
			cannon.anchor.setTo(0.5, 0.5);
			
			beds = game.add.group();
			shared.makeBeds(beds, 'catBed', 100, 50, 100, 2, game.world.width, game.world.height, 1);
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
            //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
			
			//	Rotates the bouncy object to follow the pointer
			shared.rotateToMouse(cannon, 8);
			
			if (game.input.activePointer.justPressed(30)){
				//	Only allow one action per click
				shoot = shared.shoot(cannon, 'cat1');
			}
			if(shoot != null){
				//console.log(shoot.body.velocity);
			}
        }
    };
};
