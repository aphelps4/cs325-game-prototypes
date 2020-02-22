"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	var map = null;
	var tileset = null;
	var layer = null;
	var tileSize = 200;
	
	var player = null;
	var playerPortrait = null;
	//	For battles so players will not move through map
	var canMove = true;
	var fightMenu = null;
	var attackButton = null;
	var portraitBackground = null;
	var portraitFrame = null;
	
	var battleBackground = null;
	var waitForFight = false;
	//	min and max enemies varies by floor
	var minEnemies = 1;
	var maxEnemies = 3;
	var enemyList = [];
	
	var cursors = null;
	var pointer = null;
	
	//	only allow the player to move when the time is up to stop them from moving too quick
	//	can change number for different "feels" when playing
	var pause = 20;
	var moveTimer = pause;
	
	var attackPause = 30;
	var attackTimer = 0;
    
    function startBattle(){
		if (battleBackground == null){
			//	Summon background
			battleBackground = game.add.sprite(player.x, player.y, 'battleBackground');
			battleBackground.anchor.setTo(0.5, 0.5);
			
			//	Makes the portrait and moves it to the corner - fine tune later
			playerPortrait = game.add.sprite(battleBackground.x, battleBackground.y, 'portraitWolf', 0);
			playerPortrait.anchor.setTo(0.5, 0.5);
			playerPortrait.x = battleBackground.x - 220;
			playerPortrait.y = battleBackground.y + 205;
			//portraitBackground = game.add.sprite(playerPortrait.x, playerPortrait.y, 'portraitBackground', 0);
			portraitBackground = game.add.button(playerPortrait.x, playerPortrait.y, 'portraitBackground', menu)
			portraitBackground.anchor.setTo(0.5, 0.5);
			portraitBackground.moveDown();
			portraitFrame = game.add.sprite(playerPortrait.x, playerPortrait.y, 'portraitFrame', 0);
			portraitFrame.anchor.setTo(0.5, 0.5);
			
			//	Make enemies
			//var enemyAmount = game.rnd.between(minEnemies, maxEnemies);
			var enemyAmount = generateEnemyAmount();
			enemyList.length = enemyAmount;
			spawnEnemies(enemyAmount);
			
			//	Do not allow the player to move while battling
			canMove = false;
		}
	}
	
	function generateEnemyAmount(){
		var chance = game.rnd.between(1, 10);
		
		if (1 <= chance && chance <= 5){
			//	50% chance of only one enemy
			return 1;
		}
		else if(6 <= chance && chance <= 8){
			//	30% chance of two enemies
			return 2;
		}
		else{
			//	20% chance of three enemies
			return 3;
		}
	}
	
	function spawnEnemies(num){
		for (var i = 0; i < enemyList.length; i++){
			enemyList[i] = game.add.sprite(battleBackground.x, battleBackground.y - 30, 'portraitRabbit', 0);
			enemyList[i].anchor.setTo(0.5, 0.5);
			
			//	Calculate the x amount to move the enemies - fine tune later
			//	Will range from -1 to 1 when the enemy range is 1-3
			var calcx = -1 + i;
			calcx = calcx * 180;
			enemyList[i].x += calcx;
		}
	}
	
	function menu(){
		fightMenu = game.add.sprite(battleBackground.x, battleBackground.y, 'fightMenu', 0);
		fightMenu.anchor.setTo(0.5, 0.5);
		attackButton = game.add.button(fightMenu.x, fightMenu.y, 'attackButton', chooseEnemy, null, 'hover', 'normal', 'click');
		attackButton.anchor.setTo(0.5, 0.5);
	}
	
	function chooseEnemy(){
		//Nothing yet
		fightMenu.destroy();
		attackButton.destroy();
		waitForFight = true;
		for (var i = 0; i < enemyList.length; i++){
			//	Allow enemies to receive input
			enemyList[i].inputEnabled = true;
		}
		attackTimer = 0;
		
	}

	function oneEnemy(){
		
		if (enemyList[0].input.checkPointerDown(pointer)){
			//	Destroy the one enemy
			//enemyList[0].destroy();
		
			//	Only one enemy so battle is complete
			waitForFight = false;
			battleOver();
		}
	}
	
	function twoEnemy(){
		//	Destroy the chosen enemy
		if (enemyList[0].input.checkPointerDown(pointer)){
			enemyList[0].kill();
			waitForFight = false;
		}
		else if (enemyList[1].input.checkPointerDown(pointer)){
			enemyList[1].kill();
			waitForFight = false;
		}
		checkBattleDone();
	}
	
	function threeEnemy(){
		//	Destroy the one enemy
		if (enemyList[0].input.checkPointerDown(pointer)){
			enemyList[0].kill();
			waitForFight = false;
		}
		else if (enemyList[1].input.checkPointerDown(pointer)){
			enemyList[1].kill();
			waitForFight = false;
		}
		else if (enemyList[2].input.checkPointerDown(pointer)){
			enemyList[2].kill();
			waitForFight = false;
		}
		checkBattleDone();
	}
	
	function checkBattleDone(){
		var dead = 0;
		for (var i = 0; i < enemyList.length; i++){
			if (enemyList[i].alive == false){
				//	Count the number of dead enemies
				dead++;
			}
		}
		if (dead == enemyList.length){
			//	All enemies are dead, battle is over
			battleOver();
		}
	}
	
	function battleOver(){
		if (battleBackground != null){
		battleBackground.destroy();
		//	Make null so the program can remake it
		battleBackground = null;
		//	Allow the player to move again now that the battle is over
		canMove = true;
		playerPortrait.destroy();
		portraitBackground.destroy();
		portraitFrame.destroy();
		for(var i = 0; i < enemyList.length; i++){
			enemyList[i].destroy();
		}
		enemyList = [];
		}
	}
	
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
			
			//	Change the background color to look grassy
			game.stage.backgroundColor = "0x4BC421"
			
			//	code for Phaser grid movement example
			map = game.add.tilemap('map', tileSize, tileSize);
			tileset = map.addTilesetImage('tiles', null, tileSize, tileSize);
			layer = map.createLayer(0);
			layer.resizeWorld();
			
			//	player = game.add.image(32+16, 32+16, 'car');
			//player = game.add.sprite(32+16, 32+16, 'car', 0);
			player = game.add.sprite(tileSize+100, tileSize+100, 'overWorldWolf', 0);
			//	player.animations.add for making animations
			//	Make the player the same size as the tiles
			player.height = tileSize;
			player.width = tileSize;
			player.anchor.setTo(0.5, 0.5);
			
			game.camera.follow(player);
			
			//	Battle assets
			
			//	Phaser.Input.Keyboard.JustDown for when you want just one press registered
			cursors = game.input.keyboard.createCursorKeys();
			pointer = game.input.activePointer;
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
            //	bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
			
			/*if (game.input.activePointer.isDown && canMove){
				//	Test battle here before making it randomly happen
				startBattle();
			}*/
			
			var enemyEncounter = game.rnd.between(1, 10)
			
			//	code for Phaser grid movement example
			//	Left
			if (cursors.left.isDown && canMove){
				//	Only let the player move when they are allowed
				
				//	Get the tile to the left of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(player.x - tileSize, player.y);
				
				//	changing the way the player is facing; could possibly change sprite if animation supports it
				player.angle = 180;
				
				//	Checking if the tile to the left is a solid wall (denoted by 2 in the cvs tilemap)
				if (tile.index === 2){
					//	Blocked, we can not move
				}
				else{
					if (moveTimer >= pause){
						player.x -= tileSize;
						//	player has moved so prevent them from moving again for a short while
						moveTimer = 0;
						if (enemyEncounter <= 2){
							//	20% of encountering an enemy while moving
							startBattle();
						}
					}
				}
				
			}
			
			//	Right
			if (cursors.right.isDown && canMove){
				//	Get the tile to the right of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(player.x + tileSize, player.y);
				
				player.angle = 0;
				game.camera.x += 200;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (moveTimer >= pause){
						player.x += tileSize;
						moveTimer = 0;
						if (enemyEncounter <= 2){
							//	20% of encountering an enemy while moving
							startBattle();
						}
					}
				}
				
			}
			
			//	Up
			if (cursors.up.isDown && canMove){
				
				//	Get the tile to the top of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(player.x, player.y - tileSize);
				
				player.angle = -90;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (moveTimer >= pause){
						player.y -= tileSize;
						moveTimer = 0;
						if (enemyEncounter <= 2){
							//	20% of encountering an enemy while moving
							startBattle();
						}
					}
				}
				
			}
			
			//	Down
			if (cursors.down.isDown && canMove){
				
				//	Get the tile to the bottom of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(player.x, player.y + tileSize);
				
				player.angle = 90;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (moveTimer >= pause){
						player.y += tileSize;
						moveTimer = 0;
						if (enemyEncounter <= 2){
							//	20% of encountering an enemy while moving
							startBattle();
						}
					}
				}
				
			}
			
			if (waitForFight && attackTimer >= attackPause){
				//	We are waiting for the player to fight an enemy
				if (enemyList.length == 1){
					oneEnemy();
				}
				else if (enemyList.length == 2){
					twoEnemy();
				}
				else{
					threeEnemy();
				}
			}
			
			moveTimer++;
			attackTimer++;
			
        }
    };
};
