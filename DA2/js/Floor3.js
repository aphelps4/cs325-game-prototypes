"use strict";

GameStates.makeFloor3 = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	
	var player = null;
	var walkspeed = 3;
	var move = true;
	
	var floor1 = null;
	var ground = null;
	var layer = null;
	var fog = null;
	var light = null;
	
	var card1 = [null, null];
	var flipCount = 0;
	var solved = false;
	
	var cursors = null;
	var pointer = null;
	
	var canClick = true;
	
	var oneEnd = false;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
	
	function setUpPuzzle(){
		//	Setting up our puzzle for the player to play
		//	Canvas height = 600  Canvas Width = 800
		//	Card height = 100    Card Width = 75
		card1[0] = game.add.sprite(game.camera.x + 200, 200, 'cardFinal');
		card1[1] = game.add.sprite(game.camera.x + 500, 200, 'cardFinal');
		
		for (var i = 0; i < 2; i++){
			card1[i].inputEnabled = true;
			card1[i].animations.add('back', [0]);
			card1[i].animations.add('flip', [1]);
		}
	}
	
	function playPuzzle(){
		//	Check for player input
		for (var i = 0; i < 2; i++){
			if (canClick){
				if (card1[i].input.checkPointerDown(pointer)){
					/*if ((flip1 + flip2 + flip3) == 2){
						//	Only reach here if player was unsuccessful
						resetPuzzle();
					}*/
					//	Player chose card, flip it over and do not let them choose it again
					card1[i].play('flip');
					card1[i].inputEnabled = false;
					flipCount++;
					canClick = false;
				}
			}
		}
		
		//	Two cards have been chosen, check if they are correct
		/*if ((flip1 + flip2 + flip3) == 2){
			checkCards();
		}*/
		
		//	Check if puzzle is completed
		puzzleDone();
		
	}
	
	function puzzleDone(){
		//	Three pairs in first room so count should be 3
		if (flipCount == 2){
			for (var i = 0; i < 2; i++){
				//	Destroy all the hidden cards
				card1[i].destroy();
			}
			//	Destroy the fog and allow player to move so the player can move forward to next room
			fog.destroy();
			solved = true;
			move = true;
		}
	}
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
			
			//	Environment
			floor1 = game.add.tilemap('floor1', 100, 100);
			ground = floor1.addTilesetImage('ground', null, 100, 100);
			layer = floor1.createLayer(0);
			floor1.setCollision(1, true);
			layer.resizeWorld();
			fog = game.add.sprite(1000, 0, 'fog');
			
			//	Creates the player
			player = game.add.sprite(40, 430, 'MC', 0);
			player.animations.add('still', [0]);
			player.animations.add('leftright', [1,2,3,0], 5, true);
			player.anchor.setTo(0.5, 0.5);
			
			//	Physics for player
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.gravity.y = 100;
			player.body.collideWorldBounds = true;
			
			//	End
			light = game.add.sprite(1300, 0, 'light');
			
			game.camera.follow(player);
			
			//	Input
			cursors = game.input.keyboard.createCursorKeys();
			pointer = game.input.activePointer;
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
			
			//	Do not let player fall past the floor tiles
			game.physics.arcade.collide(player, layer);
			
			//	Movement input
			if (move){
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
			}
			
			//	Puzzle
			if (!solved){
				if (player.overlap(fog)){
					//	Do not allow the player to move while they solve the puzzle
					if (move){
						setUpPuzzle();
					}
					move = false;
					player.play('still');
				}
				if (!move){
					//	Player is playing game when they are not allowed to move
					playPuzzle();
				}
				
				//	Clicker
				if (pointer.isUp){
					//	Allow the player to click again once they have stopped clicking
					canClick = true;
				}
			}
			
			//	End of game
			if (player.x >= 1350 && !oneEnd){
				game.add.sprite(game.camera.x, game.camera.y, 'end');
				oneEnd = true;
				move = false;
			}
			/*if (player.overlap(light)){
				if (cursors.up.isDown){
					//	Player hit prompt to move to next floor
					//	Final floor do not move
				}
			}*/
        }
    };
};
