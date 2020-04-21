"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 600, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	
	// An object for shared variables, so that them main menu can show
	// the high score if you want.
	var shared = {
		
		state : {
			
			team : [null, null, null, null],
			
			teamPlace : 0
			
		},
		
		load : function(){
			//	Set up the game for the player.
			this.state.team[0] = {
				name : 'Wolf',
				lvl : 1,
				healthLeft : 10,
				hp : 10,
				str : 4,
				mag : 4,
				def : 4,
				spd : 4,
				sprite : null,
				background : null,
				frame : null,
				battleSetup : function(x, y){
					//	Place the portrait of the wolf for battle purposes.
					this.background = game.add.button(x, y, 'portraitBackground', dungeon.openFightMenu);
					this.sprite = game.add.sprite(x, y, 'portraitWolf', 0);
					this.frame = game.add.sprite(x, y, 'portraitFrame', 0);
				},
				battleEnd : function(){
					this.background.destroy();
					this.sprite.destroy();
					this.frame.destroy();
				}
			};
			this.state.teamPlace += 1;
		},
		
		openMenu : function(x, upy, downy, menuBackground, buttonHeight, xbuffer, ybuffer, data){
			//	Open a menu in the specified area with the given options in a vertical format
			//	x will be the left bound where the menu objects are placed
			//	upy and downy will be used to determine the general area for the options to go
			//	menuBackground is the background for the menu if it exists, null if it does not
			//	buttonHeight will be used for calculated how to place menu objects
			//	xbuffer will be used if the options should be placed away from the edge of a menu background
			//	ybuffer will be used to determine the space between the options which are being placed vertically
			//	data will contain an object holding information that holds the options and the functions
			if (data.menuButtons.length != data.buttonFunctions.length){
				//	Not enough functions for our buttons
				console.log("There should be the same amount of functions as there are options.");
			}
			var menu = {
				
				menuBackground : null,
				
				buttons : [],
				
				functions : [],
				
				destroy : function(){
					//	Destroys everything in the menu
					if (this.menuBackground != null){
						this.menuBackground.destroy();
					}
					for (var i = 0; i < this.buttons.length; i++){
						this.buttons[i].destroy();
					}
					this.buttons = [];
					this.functions = [];
				}
				
			};
			
			if (menuBackground != null){
				menu.menuBackground = game.add.sprite(x, upy, menuBackground, 0);
			}
			menu.buttons.length = data.menuButtons.length;
			menu.functions = data.buttonFunctions;
			
			var mul = data.menuButtons.length;
			var overallHeight = buttonHeight * mul;
			mul -= 1;	//	Calculate the buffer amount between the options vertically
			overallHeight = overallHeight + (ybuffer * mul);
			var yplace = ((upy + downy)/2) - (overallHeight/2);	//	Middle of page then up half the overall height
			for (var i = 0; i < data.menuButtons.length; i++){
				//	Add the buttons in their respective places
				menu.buttons[i] = game.add.button((x + xbuffer), yplace, data.menuButtons[i], menu.functions[i], null, 'hover', 'normal', 'click');
				yplace += buttonHeight + ybuffer;
			}
			return menu;
		}
		
	};
	
	var dungeon = {
		
		player : null,
		
		direction : 0,
		
		canMove : true,
		
		battleData : {
			
			battleBackground : null,
			
			menu : null,
			
			menuButtons : [
			
				'attackButton'
			
			],
			
			buttonFunctions : [
			
				function(){
					//	This is the function for the attack button
					if (dungeon.battleData.menu != null){
						dungeon.battleData.menu.destroy();
					}
					dungeon.waitForFight = true;
					for (var i = 0; i < dungeon.enemies.length; i++){
						//	Allow enemies to receive input
						dungeon.enemies[i].sprite.inputEnabled = true;
					}
					dungeon.battling = true;
				}
			
			]
			
		},
		
		battleBackground : null,
		
		enemies : [],
		
		pause : 20,
		
		moveTimer : 20,
		
		battling : false,
		
		waitForFight : false,
		
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
		
		move : function(cursors, map, tileSize, enctrChance){
			//	Move the player if they are allowed to move
			//	cursors is the key input from the player
			//	map is the current map the player is on
			//	tileSize is the size of the tiles that make up the map
			//	enctrChance is the chance of running into enemies
			//	Return true if the player runs into enemies
			
			//	Divisor must evenly divide the tileSize or else this will not work - can possibly fix by checking if within the range of moveLength
			var moveLength = tileSize / 20;	//	Finish moving in 20 frames
			
			if (!((this.player.x - (tileSize/2)) % tileSize == 0)){
				//	Player is not snapped in the x-axis
				this.player.x += moveLength * this.direction;
				
				if ((this.player.x - (tileSize/2)) % tileSize == 0){
					//	Snapped into place after that movement so check for encounter
					if (this.randomEncounter(enctrChance)){
						//	Random encounter here
						return true;
					}
				}
			}
			else if(!((this.player.y - (tileSize/2)) % tileSize == 0)){
				//	Player is not snapped in the y-axis
				this.player.y += moveLength * this.direction;
				
				if ((this.player.y - (tileSize/2)) % tileSize == 0){
					//	Snapped into place after that movement so check for encounter
					if (this.randomEncounter(enctrChance)){
						//	Random encounter here
						return true;
					}
				}
			}
			
			//	Left
			else if (cursors.left.isDown && this.canMove){
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
					/*
					if (this.moveTimer >= this.pause){
						this.player.x -= tileSize;
						//	player has moved so prevent them from moving again for a short while
						this.moveTimer = 0;
						if (this.randomEncounter(enctrChance)){
							//	Random encounter here
							return true;
						}
					}*/
					this.player.x -= moveLength;
					this.direction = -1;
				}
				
			}
			
			//	Right
			else if (cursors.right.isDown && this.canMove){
				//	Get the tile to the right of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x + tileSize, this.player.y);
				
				this.player.angle = 0;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					/*
					if (this.moveTimer >= this.pause){
						this.player.x += tileSize;
						this.moveTimer = 0;
						if (this.randomEncounter(enctrChance)){
							//	Random encounter here
							return true;
						}
					}*/
					this.player.x += moveLength;
					this.direction = 1;
				}
				
			}
			
			//	Up
			else if (cursors.up.isDown && this.canMove){
				
				//	Get the tile to the top of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x, this.player.y - tileSize);
				
				this.player.angle = -90;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					/*if (this.moveTimer >= this.pause){
						this.player.y -= tileSize;
						this.moveTimer = 0;
						if (this.randomEncounter(enctrChance)){
							//	Random encounter here
							return true;
						}
					}*/
					this.player.y -= moveLength;
					this.direction = -1;
				}
				
			}
			
			//	Down
			else if (cursors.down.isDown && this.canMove){
				
				//	Get the tile to the bottom of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x, this.player.y + tileSize);
				
				this.player.angle = 90;
				
				if (tile.index === 2){
					//	Blocked
				}
				else{
					/*if (this.moveTimer >= this.pause){
						this.player.y += tileSize;
						this.moveTimer = 0;
						if (this.randomEncounter(enctrChance)){
							//	Random encounter here
							return true;
						}
					}*/
					this.player.y += moveLength;
					this.direction = 1;
				}
				
			}
			
			//	Failed the encounter check
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
			
			//	Place the players team for user input.
			var width = 156;
			var buffer = 0;
			
			var overallWidth = width * shared.state.teamPlace;
			var xplace = (this.battleBackground.x) - (overallWidth/2);	//	Middle of page then up half the overall height
			for (var i = 0; i < shared.state.teamPlace; i++){
				//	Randomly create an enemy from available encounters and place it
				shared.state.team[i].battleSetup(xplace, (this.battleBackground.y + 110));
				xplace += width + buffer;
			}
			
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
			
			//	Stored variables for now may want to add them to input data
			var width = 156;
			var buffer = 30;
			
			//	Enemy amount has been generated, place enemies
			//var back = ceil(enemyAmount/2)
			//var front = floor(enemyAmount/2)
			//	Always start left most in the back (so even in the back odd in front)
			this.enemies.length = enemyAmount;
			var overallWidth = width * enemyAmount;
			overallWidth = overallWidth + (buffer * (enemyAmount - 1));
			var xplace = (this.battleBackground.x) - (overallWidth/2);	//	Middle of page then up half the overall height
			for (var i = 0; i < enemyAmount; i++){
				//	Randomly create an enemy from available encounters and place it
				var choice = game.rnd.between(0, (availableEnemies.length - 1));
				var enemy = availableEnemies[choice].calculateStats(1);
				enemy.sprite.x = xplace;
				if (i % 2 == 0){
					//	Place the enemy in the back if they are even
					enemy.sprite.y = this.battleBackground.y + plcmntData.back;
				}
				else{
					//	Place the enemy in the front if they are odd
					enemy.sprite.y = this.battleBackground.y + plcmntData.front;
				}
				this.enemies[i] = enemy;
				xplace += width + buffer;
			}
		},
		
		openFightMenu : function(){
			//	Open the menu required to fight in battle
			dungeon.battleData.menu = shared.openMenu(game.camera.x, game.camera.y + 200, game.camera.y + 400, 'fightMenu',
				15, 5, 10, dungeon.battleData);
		},
		
		chooseEnemy : function(){
			//	Allow the user to select an enemy when attacking.
			if (this.battling){
				for (var i = 0; i < this.enemies.length; i++){
					if (this.enemies[i].sprite.input.justPressed(0, 30)){
						console.log(i);
						this.enemies[i].sprite.kill();
					}
				}
			}
		},
		
		battleOver : function(){
			//	Check if the battle is over and go back to dungeon crawling if it is.
			if (this.battling){
				var dead = 0;
				for (var i = 0; i < this.enemies.length; i++){
					if (this.enemies[i].sprite.alive == false){
						//	Count the number of dead enemies
						dead++;
					}
				}
				if (dead == this.enemies.length){
					//	All enemies are dead, battle is over
					this.battleBackground.destroy();
					//	Destroy the enemies.
					for (var i = 0; i < this.enemies.length; i++){
						this.enemies[i].sprite.destroy();
					}
					this.enemies = [];
					//	Destroy the team portraits
					for (var i = 0; i < shared.state.teamPlace; i++){
						shared.state.team[i].battleEnd();
					}
					//	End battling and allow player to move again
					this.battling = false;
					this.canMove = true;
				}
			}
		}
	};
	
	game.state.add( 'Boot', GameStates.makeBoot( game ) );
	game.state.add( 'Preloader', GameStates.makePreloader( game ) );
	game.state.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	game.state.add( 'Town', GameStates.makeTown( game, shared ) );
	game.state.add( 'Game', GameStates.makeGame( game, shared ) );
	game.state.add( 'Forest1', GameStates.makeForest1( game, shared, dungeon ) );

	//	Now start the Boot state.
	game.state.start('Boot');

};
