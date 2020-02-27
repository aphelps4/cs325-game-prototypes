"use strict";

GameStates.makeFloor2 = function( game, shared ) {
    // Create your own variables.
    var background = null;
	
	var cat = null;
	var catHitBox = null;
	var cannon = null;
	var shoot = null;
	var beds = null;
	
	var catHead = null;
	var text = null;
	var lives = null;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
			
			background = game.add.sprite(0, 0, 'cafeBackground');
			
			beds = game.add.group();
			shared.makeBeds(beds, 'catBed', 100, 50, 100, 2, game.world.width, game.world.height, 2);
			
			cat = game.add.sprite(-100, -100, 'cat1');
			cat.anchor.setTo(0.5, 0.5);
			game.physics.enable(cat, Phaser.Physics.ARCADE);
			cat.takeOne = false;
			catHitBox = game.add.sprite(20, 0, 'catHitBox');
			catHitBox.anchor.setTo(0.5, 0.5);
			game.physics.enable(catHitBox, Phaser.Physics.ARCADE);
			catHitBox.body.setCircle(30);
			cat.addChild(catHitBox);
			cannon = game.add.sprite(60, 540, 'cannon');
			cannon.anchor.setTo(0.5, 0.5);
			
			catHead = game.add.sprite(0, 0, 'catHead');
			lives = 3;
			var style = { font: "25px Verdana", fill: "#000000", align: "center" };
            text = game.add.text( 30, 0, lives.toString(), style );
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
			shared.rotateToMouse(cannon);
			
			if (game.input.activePointer.justPressed(30) && shared.objectOut(catHitBox)){
				//	Only allow one action per click
				shared.shoot(cannon, cat);
				cat.updateTransform();
				var rand = game.rnd.between(0, 2);
				var sound = game.add.audio(shared.meows[rand]);
				sound.play();
				cat.takeOne = true;
			}
			
			beds.forEach(shared.catInBed, this, true, catHitBox, cat);
			
			if (beds.checkAll('frame', 1)){
				//	All beds have been filled and we should move to the next room
				shared.score += lives;
				game.state.start('Win');
			}
			
			if (shared.objectOut(catHitBox) && cat.takeOne){
				//	Cat has fallen out of bounds and it is time to take one from lives
				lives -= 1;
				text.text = lives.toString();
				cat.takeOne = false;
			}
			
			if (lives == 0){
				//	Game over
				game.state.start('Lose');
			}
        }
    };
};
