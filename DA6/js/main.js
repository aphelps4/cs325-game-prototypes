"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 600, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	
	// An object for shared variables, so that the main menu can show
	// the high score if you want.
	var shared = {
		
		state : {
			
			team : [null, null, null, null],
			
			teamPlace : 0,
			
			maps : [
			
				{
					name : 'forest1',
					data : []
				}
			
			]
			
		},
		
		load : function(){
			//	Set up the game for the player.
			this.state.team[0] = {
				name : 'Wolf',
				lvl : 1,
				haveExp : 0,
				exp : 5,
				healthLeft : 50,
				hp : 50,
				str : 10,
				mag : 10,
				def : 10,
				spd : 10,
				sprite : null,
				background : null,
				frame : null,
				statDisplay : null,
				battleSetup : function(x, y){
					//	Place the portrait of the wolf for battle purposes.
					this.background = game.add.button(x, y, 'portraitBackground', dungeon.openFightMenu);
					this.sprite = game.add.sprite(x, y, 'portraitWolf', 0);
					this.frame = game.add.sprite(x, y, 'portraitFrame', 0);
					//	Draw the healthbar
					var height = 20;
					var percentHealth = this.healthLeft / this.hp;
					var frameBuffer = 4;
					this.statDisplay = game.add.graphics(0,0);
					this.statDisplay.beginFill(0x1546C0, 1);
					this.statDisplay.drawRect(x + frameBuffer, (y + this.frame.height) - height, this.frame.width - (2 * frameBuffer), height - frameBuffer);
					this.statDisplay.beginFill(0x00DB20, 1);
					this.statDisplay.drawRect(x + frameBuffer, (y + this.frame.height) - height, (this.frame.width - (2 * frameBuffer)) * percentHealth, height - frameBuffer);
				},
				battleEnd : function(){
					this.background.destroy();
					this.sprite.destroy();
					this.frame.destroy();
					this.statDisplay.destroy();
				},
				calculateStats(){
					//	Takes the character level and calculates the stats
					//	hp
					var health = ((650 / 49) * (this.lvl - 1)) + 50;
					var healthChange = this.hp - health;
					this.hp = health;
					this.healthLeft += healthChange;
					//	others
					var stat = ((110 / 49) * (this.lvl - 1)) + 10;
					this.str = stat;
					this.mag = stat;
					this.def = stat;
					this.spd = stat;
					//	exp
					stat = (45 * (this.lvl - 1)) + 5;
					this.exp = stat;
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
		
		mapGraphics : null,
		
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
						dungeon.battleData.menu = null;
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
		
		battling : false,
		
		expPage : {
			
			background : null,
			
			nameData : [],
			
			barData : null,
			
			destroy : function(){
				if (this.background != null){
					this.background.destroy();
					this.background = null;
				}
				for (var i = 0; i < this.nameData.length; i++){
					this.nameData[i].destroy();
				}
				if (this.barData != null){
					this.barData.destroy();
				}
			}
			
		},
		
		initializePlayer : function(x, y, sprite){
			//	Initialize the sprite the player will be controlling
			//	x will be the x position, y will be the y position
			//	sprite will be a string to get the specific sprite
			
			/*if (this.player == null){
				this.player = game.add.sprite(x, y, sprite, 0);
				this.player.animations.add('still', [0]);
				this.player.animations.add('moving', [1,2,3,0], 8, true);
				this.player.play('still');
			}
			else{*/
			if (this.player != null){
				//	Destroy the past player object before we replace it
				this.player.destroy();
			}
			this.player = game.add.sprite(x, y, sprite, 0);
			this.player.animations.add('still', [0]);
			this.player.animations.add('moving', [1,2,3,0], 8, true);
			this.player.play('still');
		},
		
		move : function(cursors, map, mapAccess, tileSize, enctrChance){
			//	Move the player if they are allowed to move
			//	cursors is the key input from the player
			//	map is the current map the player is on
			//	mapAccess is for accessing the minimap data in the state for storage purposes
			//	tileSize is the size of the tiles that make up the map
			//	enctrChance is the chance of running into enemies
			//	Return true if the player runs into enemies
			
			//	Store the wall number here so it is easier to change
			var wall = 1;
			var wall2 = 2;
			var wall3 = 4;
			//	Store the change scene numbers here for now, will need to add a list to parameters later
			var town = 3;
			var forest2 = 5;
			
			
			//	Divisor must evenly divide the tileSize or else this will not work - can possibly fix by checking if within the range of moveLength
			var moveLength = tileSize / 20;	//	Finish moving in 20 frames
			
			if (!((this.player.x - (tileSize/2)) % tileSize == 0)){
				//	Player is not snapped in the x-axis
				this.player.x += moveLength * this.direction;
				
				if ((this.player.x - (tileSize/2)) % tileSize == 0){
					//	Snapped into place after that movement so check for encounter or move to new area
					this.player.play('still');
					if (map.getTileWorldXY(this.player.x, this.player.y).index == town){
						//	On top of the tile that moves the character to town so do so.
						game.state.start('Town');
						return false;
					}
					if (map.getTileWorldXY(this.player.x, this.player.y).index == forest2){
						//	On top of the tile that moves the character to forest2 but that does not exist so go to town
						game.state.start('Town');
						return false;
					}
					this.storeNearbyMap(map, mapAccess);
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
					this.player.play('still');
					if (map.getTileWorldXY(this.player.x, this.player.y).index == town){
						//	On top of the tile that moves the character to town so do so.
						game.state.start('Town');
						return false;
					}
					if (map.getTileWorldXY(this.player.x, this.player.y).index == forest2){
						//	On top of the tile that moves the character to forest2 but that does not exist so go to town
						game.state.start('Town');
						return false;
					}
					this.storeNearbyMap(map, mapAccess);
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
				
				//	Checking if the tile to the left is a solid wall
				if (tile.index == wall || tile.index == wall2 || tile.index == wall3){
					//	Blocked, we can not move
				}
				else{
					this.player.x -= moveLength;
					this.player.play('moving');
					this.direction = -1;
				}
				
			}
			
			//	Right
			else if (cursors.right.isDown && this.canMove){
				//	Get the tile to the right of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x + tileSize, this.player.y);
				
				this.player.angle = 0;
				
				if (tile.index === wall || tile.index == wall2 || tile.index == wall3){
					//	Blocked
				}
				else{
					this.player.x += moveLength;
					this.player.play('moving');
					this.direction = 1;
				}
				
			}
			
			//	Up
			else if (cursors.up.isDown && this.canMove){
				
				//	Get the tile to the top of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x, this.player.y - tileSize);
				
				this.player.angle = -90;
				
				if (tile.index === wall || tile.index == wall2 || tile.index == wall3){
					//	Blocked
				}
				else{
					this.player.y -= moveLength;
					this.player.play('moving');
					this.direction = -1;
				}
				
			}
			
			//	Down
			else if (cursors.down.isDown && this.canMove){
				
				//	Get the tile to the bottom of the player and check the tilemap to see if it is a valid space
				var tile = map.getTileWorldXY(this.player.x, this.player.y + tileSize);
				
				this.player.angle = 90;
				
				if (tile.index === wall || tile.index == wall2 || tile.index == wall3){
					//	Blocked
				}
				else{
					this.player.y += moveLength;
					this.player.play('moving');
					this.direction = 1;
				}
				
			}
			
			//	Failed the encounter check
			return false;
		},
		
		storeNearbyMap : function(map, mapAccess){
			//	Store the tile the player is on and all adjacent tiles in the map data
			//	Add one to the index when storing since minimap data will have the 0 frame be nothing
			var tileStore = map.getTileWorldXY(this.player.x, this.player.y);	//	Under player
			shared.state.maps[mapAccess].data[tileStore.x][tileStore.y] = tileStore.index + 1;
			tileStore = map.getTileWorldXY(this.player.x, this.player.y - map.tileHeight);	//	Up from player
			shared.state.maps[mapAccess].data[tileStore.x][tileStore.y] = tileStore.index + 1;
			tileStore = map.getTileWorldXY(this.player.x + map.tileWidth, this.player.y);	//	Right from player
			shared.state.maps[mapAccess].data[tileStore.x][tileStore.y] = tileStore.index + 1;
			tileStore = map.getTileWorldXY(this.player.x, this.player.y + map.tileHeight);	//	Down from player
			shared.state.maps[mapAccess].data[tileStore.x][tileStore.y] = tileStore.index + 1;
			tileStore = map.getTileWorldXY(this.player.x - map.tileWidth, this.player.y);	//	Left from player
			shared.state.maps[mapAccess].data[tileStore.x][tileStore.y] = tileStore.index + 1;
		},
		
		viewMiniMap : function(tileSize, mapAccess){
			//	Allow the player to view where they have been on the current map by pressing the key E or SHIFT
			//	TODO make it so they can only view map when locked in the grid
			var key1 = game.input.keyboard.addKey(Phaser.Keyboard.E);
			var key2 = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
			if (key1.downDuration(1) || key2.downDuration(1)){
				if (this.mapGraphics == null || !this.mapGraphics.alive){
					//	Only draw the map if it has not already been drawn
					if ((this.player.x - (tileSize/2)) % tileSize == 0 && (this.player.y - (tileSize/2)) % tileSize == 0 &&
						this.canMove){
						//	Only let the player view the map if they are not moving or battling
						this.canMove = false;
						this.mapGraphics = game.add.graphics(0,0);
						this.mapGraphics.beginFill(0xCDF4E5, 0.5);
						this.mapGraphics.drawRect(game.camera.x, game.camera.y, game.camera.width, game.camera.height);
					}
				}
			}
			else if (key1.isUp && key2.isUp){
				if (this.mapGraphics != null && this.mapGraphics.alive){
					this.mapGraphics.destroy();
					this.canMove = true;
				}
			}
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
			if (dungeon.battleData.menu == null){
				//	Create a new menu if one has not been established or the last one was destroyed
				dungeon.battleData.menu = shared.openMenu(game.camera.x, game.camera.y + 200, game.camera.y + 400, 'fightMenu',
					15, 5, 10, dungeon.battleData);
			}
			//	Set it so player can not click on enemies if they are opening the menu again
			for (var i = 0; i < dungeon.enemies.length; i++){
				dungeon.enemies[i].sprite.inputEnabled = false;
			}
		},
		
		enemyInput : function(){
			//	Allow the user to interact with an enemy when attacking.
			if (this.battling){
				for (var i = 0; i < this.enemies.length; i++){
					//	Clicking on enemy
					if (this.enemies[i].sprite.input.justPressed(0, 30)){
						//	An enemy was chosen so make them receive the damage and make the other enemies unselectable
						this.enemies[i].sprite.kill();
						if (this.enemies[i].statDisplay != null){
							this.enemies[i].statDisplay.destroy();
							this.enemies[i].statDisplay = null;
						}
						for (var i = 0; i < dungeon.enemies.length; i++){
							dungeon.enemies[i].sprite.inputEnabled = false;
						}
					}
					//	Hovering over an enemy
					else if (this.enemies[i].sprite.input.justOver(0, 30)){
						//	Display the health of the enemy so the player knows if they want to attack that one
						var x = this.enemies[i].sprite.x;
						var y = this.enemies[i].sprite.y;
						var height = 10;
						var percentHealth = this.enemies[i].healthLeft / this.enemies[i].hp;
						this.enemies[i].statDisplay = game.add.graphics(0,0);
						this.enemies[i].statDisplay.beginFill(0x1546C0, 1);
						this.enemies[i].statDisplay.drawRect(x, y - (this.enemies[i].sprite.height + height), this.enemies[i].sprite.width, height);
						this.enemies[i].statDisplay.beginFill(0x00DB20, 1);
						this.enemies[i].statDisplay.drawRect(x, y - (this.enemies[i].sprite.height + height), this.enemies[i].sprite.width * percentHealth, height);
					}
					//	No longer hovering over an enemy
					else if (this.enemies[i].sprite.input.justOut(0, 30)){
						//	Delete the display of health
						if (this.enemies[i].statDisplay != null){
							this.enemies[i].statDisplay.destroy();
							this.enemies[i].statDisplay = null;
						}
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
					/*
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
					this.canMove = true;*/
					if (this.expPage.background == null){
						this.expMenu();
						
						//	Destroy the team portraits
						for (var i = 0; i < shared.state.teamPlace; i++){
							shared.state.team[i].battleEnd();
						}
					}
					else if (game.input.activePointer.justPressed(30)){
						//	Player has clicked and wants to move on from menu
						this.expPage.destroy();
						//	All enemies are dead, battle is over, and player has viewed exp gained
						this.battleBackground.destroy();
						//	Destroy the enemies.
						for (var i = 0; i < this.enemies.length; i++){
							this.enemies[i].sprite.destroy();
						}
						this.enemies = [];
						//	End battling and allow player to move again
						this.battling = false;
						this.canMove = true;
					}
				}
			}
		},
		
		expMenu : function(){
			//	Show the player how much exp they gained
			var upy = game.camera.y + 100;
			var downy = game.camera.y + 500;
			this.expPage.background = shared.openMenu(game.camera.x, upy, downy, 'expPage', 0, 0, 0, { menuButtons : [], buttonFunctions : []});
			//	Make the bars 400 width
			
			var height = 50;
			var ybuffer = 30;
			var mul = shared.state.teamPlace;
			var overallHeight = height * mul;
			mul -= 1;	//	Calculate the buffer amount between the options vertically
			overallHeight = overallHeight + (ybuffer * mul);
			var yplace = ((upy + downy)/2) - (overallHeight/2);	//	Middle of page then up half the overall height
			var xplace = game.camera.x + 100;
			this.expPage.nameData.length = shared.state.teamPlace;
			this.expPage.barData = game.add.graphics(0,0);
			for (var i = 0; i < shared.state.teamPlace; i++){
				//	Add the buttons in their respective places
				//	Name
				var style = { font: "25px Verdana", fill: "#FFFFFF"};
				this.expPage.nameData[i] = game.add.text(xplace, yplace, shared.state.team[i].name, style);
				//	Experience
				var height = 25;
				var width = 400;
				var percentExp = 1 / 2;	//	Change this to be the teams experience over needed experience
				this.expPage.barData.beginFill(0x1546C0, 1);
				this.expPage.barData.drawRect(xplace, yplace + height, width, height);
				this.expPage.barData.beginFill(0x5EE2C5, 1);
				this.expPage.barData.drawRect(xplace, yplace + height, width * percentExp, height);
				yplace += height + ybuffer;
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
