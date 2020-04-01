"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 600, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	
	// An object for shared variables, so that them main menu can show
	// the high score if you want.
	var shared = {};
	
	var dungeon = {
		
		player : null,
		
		canMove : true,
		
		battleBackground : null,
		
		playerPortrait : null,
		
		portraitBackground : null,
		
		portraitFrame : null,
		
		enemies : [],
		
		pause : 20,
		
		moveTimer : 20,
		
		initializePlayer : function(x, y, sprite){
			//	Initialize the sprite the player will be controlling
			//	x will be the x position, y will be the y position
			//	sprite will be a string to get the specific sprite
			
			if (this.player == null){
				this.player = game.add.sprite(x, y, sprite, 0);
			}
			else{
				this.player.x = x;
				this.player.y = y;
			}
		},
		
		move : function(cursors, player, map, tileSize, moveTimer, enctrChance){
			//	Move the player if they are allowed to move
			//	cursors is the key input from the player
			//	player is the sprite that the player controls
			//	map is the current map the player is on
			//	tileSize is the size of the tiles that make up the map
			//	enctrChance is the chance of running into enemies
			//	Return true if the player runs into enemies
			
			//	Left
			if (cursors.left.isDown && this.canMove){
				//	Only let the player move when they are allowed
				
				//	Get the tile to the left of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x - tileSize, this.player.y);
				
				//	changing the way the player is facing; could possibly change sprite if animation supports it
				this.player.angle = 180;
				
				//	Checking if the tile to the left is a solid wall (denoted by 2 in the cvs tilemap)
				if (tile.index === 2){
					//	Blocked, we can not move
				}
				else{
					//	TODO Work on getting rid of the moveTimer/pause stuff
					if (this.moveTimer >= this.pause){
						this.player.x -= tileSize;
						//	player has moved so prevent them from moving again for a short while
						this.moveTimer = 0;
						//if (enemyEncounter <= 2){
							//	20% of encountering an enemy while moving
							//this.startBattle();
						//}
						if (this.randomEncounter(enctrChance)){
							//	Random encounter here
							return true;
						}
					}
				}
				
			}
			
			//	Right
			if (cursors.right.isDown && this.canMove){
				//	Get the tile to the right of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x + tileSize, this.player.y);
				
				this.player.angle = 0;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (this.moveTimer >= this.pause){
						this.player.x += tileSize;
						this.moveTimer = 0;
						//if (enemyEncounter <= 2){
							//	20% of encountering an enemy while moving
							//this.startBattle();
						//}
						if (this.randomEncounter(enctrChance)){
							//	Random encounter here
							return true;
						}
					}
				}
				
			}
			
			//	Up
			if (cursors.up.isDown && this.canMove){
				
				//	Get the tile to the top of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x, this.player.y - tileSize);
				
				this.player.angle = -90;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (this.moveTimer >= this.pause){
						this.player.y -= tileSize;
						this.moveTimer = 0;
						//if (enemyEncounter <= 2){
							//	20% of encountering an enemy while moving
							//this.startBattle();
						//}
						if (this.randomEncounter(enctrChance)){
							//	Random encounter here
							return true;
						}
					}
				}
				
			}
			
			//	Down
			if (cursors.down.isDown && this.canMove){
				
				//	Get the tile to the bottom of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x, this.player.y + tileSize);
				
				this.player.angle = 90;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					if (this.moveTimer >= this.pause){
						this.player.y += tileSize;
						this.moveTimer = 0;
						//if (enemyEncounter <= 2){
							//	20% of encountering an enemy while moving
							//this.startBattle();
						//}
						if (this.randomEncounter(enctrChance)){
							//	Random encounter here
							return true;
						}
					}
				}
				
			}
			
			//	Failed all encounter checks
			return false;
		},
		
		randomEncounter : function(chance){
			//	Calculate whether the player encounters a battle or not when moving through the dungeon
			//	chance is the probability of an encounter, ranging from 0-100
			var enemyEncounter = game.rnd.between(1, 100);
			
			if (enemyEncounter <= chance){
				//	There is an encounter so return true
				return true;
			}
			//	There was no encounter
			return false;
		},
		
		startBattle : function(rndmAmtData, rndmLvlData, plcmntData, availableEnemies){
			//	Set up the battle for the player
			//	rndmAmtData contains a list with available enemy amounts along with their probability of happening
			//	rndmLvlData contains a list of available enemy levels along with their probability of happening
			//	plcmntData contains the data on how to place the enemies
			//	availableEnemies contains the enemies that can be generated in the battle
			this.battleBackground = game.add.sprite(this.player.x, this.player.y, 'battleBackground');
			this.battleBackground.anchor.setTo(0.5, 0.5);
			
			//	Make enemies
			//var enemyAmount = game.rnd.between(minEnemies, maxEnemies);
			//var enemyAmount = generateEnemyAmount();
			//enemyList.length = enemyAmount;
			//spawnEnemies(enemyAmount);
			this.spawnEnemies(rndmAmtData, rndmLvlData, plcmntData, availableEnemies);
			
			//	Makes the portrait and moves it to the corner - fine tune later
			//	Change this to be the team portraits (possibly in the player objects)
			this.playerPortrait = game.add.sprite(this.battleBackground.x, this.battleBackground.y, 'portraitWolf', 0);
			this.playerPortrait.anchor.setTo(0.5, 0.5);
			this.playerPortrait.x = this.battleBackground.x - 220;
			this.playerPortrait.y = this.battleBackground.y + 205;
			//portraitBackground = game.add.sprite(playerPortrait.x, playerPortrait.y, 'portraitBackground', 0);
			//	Replace random encounter function call with actual menu options later
			this.portraitBackground = game.add.button(this.playerPortrait.x, this.playerPortrait.y, 'portraitBackground', this.randomEncounter)
			this.portraitBackground.anchor.setTo(0.5, 0.5);
			this.portraitBackground.moveDown();
			this.portraitFrame = game.add.sprite(this.playerPortrait.x, this.playerPortrait.y, 'portraitFrame', 0);
			this.portraitFrame.anchor.setTo(0.5, 0.5);
			
			//	Do not allow the player to move while battling
			this.canMove = false;
		},
		
		spawnEnemies : function(rndmAmtData, rndmLvlData, plcmntData, availableEnemies){
			//	Create the enemies using the given data
			//	rndmAmtData is used to determine how many enemies there will be in the battle
			//	rndmLvlData is used to determine the level of the enemies
			//	plcmntData is used to determine how to place the enemies on the screen
			//	availableEnemies is a list of enemy objects that can be found on the current level
			if ((rndmAmtData.amtMax - rndmAmtData.amtMin + 1) != rndmAmtData.prob.length){
				//	There are not enough probabilities for the available amounts
				console.log("Number of probabilities given is not equal to amount of available range");
				return;
			}
			var sum = 0;
			for (var i = 0; i < (rndmAmtData.prob.length - 1); i++){
				sum += rndmAmtData.prob[i];
				if (sum >= 100){
					//	We ended up going above available probability
					console.log("Probabilities add up to be more than 100%");
					return;
				}
			}
			
			// Issues have been dealt with, roll for enemy amount
			var enemyAmount = 0;
			var roll = game.rnd.between(1,100);
			var chance = 0;
			for (var i = 0; i < (rndmAmtData.prob.length - 1); i++){
				chance += rndmAmtData.prob[i];
				if (roll <= chance){
					//	We found our enemy amount, store it and stop the for loop
					enemyAmount = rndmAmtData.amtMin + i;
					i = rndmAmtData.prob.length;
				}
			}
			if (enemyAmount == 0){
				//	Probability failed for everything but the final roll
				enemyAmount = rndmAmtData.amtMax;
			}
			
			//	Enemy amount has been generated, place enemies
			//var back = ceil(enemyAmount/2)
			//var front = floor(enemyAmount/2)
			//	Always start left most in the back (so even in the back odd in front)
			this.enemies.length = enemyAmount;
			for (var i = 0; i < enemyAmount; i++){
				//	Randomly create an enemy from available encounters and place it
				var choice = game.rnd.between(0, (availableEnemies.length - 1));
				var enemy = availableEnemies[choice].calculateStats(1);
				enemy.sprite.x = (this.battleBackground.x - 330) + (plcmntData.width * i);
				if (i % 2 == 0){
					//	Place the enemy in the back if they are even
					enemy.sprite.y = this.battleBackground.y + plcmntData.back;
				}
				else{
					//	Place the enemy in the front if they are odd
					enemy.sprite.y = this.battleBackground.y + plcmntData.front;
				}
				this.enemies[i] = enemy;
			}
		}
	};
	
	game.state.add( 'Boot', GameStates.makeBoot( game ) );
	game.state.add( 'Preloader', GameStates.makePreloader( game ) );
	game.state.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	game.state.add( 'Game', GameStates.makeGame( game, shared ) );
	game.state.add( 'Forest1', GameStates.makeForest1( game, shared, dungeon ) );

	//	Now start the Boot state.
	game.state.start('Boot');

};
