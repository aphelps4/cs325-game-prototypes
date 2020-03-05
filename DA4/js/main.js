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
		
		player : {
			
			sprite : null,
			
			map : [],
			
			objList : []
		},
		
		initializeGame : function(){
			//	Sets up the game
			
			//	Add player
			this.player.sprite = game.add.sprite(150, 150, 'placeholder', 0);
			this.player.sprite.anchor.setTo(0.5, 0.5);
			
			//	Set up the map
			for (var i = 0; i < 10; i++){
				//	Create ten columns (x)
				var lis = [];
				for (var j = 0; j < 10; j++){
					//	Create rows with ten spots (y)
					lis.push(null);
				}
				this.player.map.push(lis);
			}
			
			//	Return the buildable/placeable objects
			//var objList = [];
			//objList.push(this.makeObject('table', 1, 1, 3));
			//return objList;
			this.player.objList.push(this.makeObject('table', 1, 1, 3));
		},
		
		makeObject : function(name, xSize, ySize, storeNum){
			//	Makes a placeable object with necessary variables
			//	name is the String that is used to make the sprite
			//	xSize and ySize are to know how much space it will take on the map
			//	storeNum is for limited resources purposes
			
			var object = {
				
				name : name,
				
				xSize : xSize,
				
				ySize : ySize,
				
				storeNum : storeNum
			}
			
			return object;
		},
		
		move : function(cursors, player, moveSpeed, map){
			//	Moves an object when receiving player input
			//	cursors is the cursors the player can press
			//	player is the sprite that the player can move
			//	moveSpeed is how quickly that sprite should move
			//	map is the tilemap that the player navigates through
			
			if (cursors.left.isDown){
				var tileLeft = map.getTileWorldXY((player.x - (player.width/2)) - moveSpeed, player.y);
				if (tileLeft != null && !(tileLeft.index <= 6)){
					//	Go left
					player.x -= moveSpeed;
				}
			}
			else if (cursors.right.isDown){
				var tileRight = map.getTileWorldXY((player.x + (player.width/2)) + moveSpeed, player.y);
				if (tileRight != null && !(tileRight.index <= 6)){
					//	Go right
					player.x += moveSpeed;
				}
			}
			else if (cursors.up.isDown){
				var tileUp = map.getTileWorldXY(player.x, (player.y - (player.height/2)) - moveSpeed);
				if (tileUp != null && !(tileUp.index <= 6)){
					//	Go up
					player.y -= moveSpeed;
				}
			}
			else if (cursors.down.isDown){
				var tileDown = map.getTileWorldXY(player.x, (player.y + (player.height/2)) + moveSpeed);
				if (tileDown != null && !(tileDown.index <= 6)){
					//	Go down
					player.y += moveSpeed;
				}
			}
		},
		
		cursorOver : function (button){
			//	Change the background to show if the cursor is over the button
			
			if (button.input.pointerOver()){
				button.background.frame = 1;
			}
			else{
				button.background.frame = 0;
			}
		},
		
		openMenu : function (menuObj, menuList, buttonBackground){
			//	Opens a menu that opens upward
			//	menuObj is the original object the player clicks
			//	menuList is the list of options that become available
			//	buttonBackground is the background of each option
			
			menuObj.frame = 1;
			var listLength = menuList.length;
			var startx = menuObj.cameraOffset.x;
			var starty = menuObj.cameraOffset.y;
			var growth = menuObj.height;
			var newObjects = [];
			
			for (var i = 1; i <= listLength; i++){
				var background = game.add.sprite(startx, starty - (i * growth), buttonBackground, 0);
				var button = game.add.sprite(startx, starty - (i * growth), menuList[i - 1], 0);
				button.inputEnabled = true;
				button.background = background;
				button.fixedToCamera = true;
				button.background.fixedToCamera = true;
				newObjects.push(button);
			}
			
			return newObjects;
		},
		
		closeMenu : function (menuObj, menuObjList){
			//	Closes the menu that opened upwards
			//	menuObj is the original button that opens the menu options
			//	menuObjList is the list of menu options that need to be deleted
			
			menuObj.frame = 0;
			
			var listLen = menuObjList.length;
			for (var i = 0; i < listLen; i++){
				menuObjList[i].background.destroy();
				menuObjList[i].destroy();
			}
			
			return null;
		},
		
		openInv : function (startx, starty, endx, endy, column, row, exitString, objList, func){
			//	Opens an inventory window
			//	startx and starty are the beginning of the area for the created inventory menu
			//	endx and endy are the end of the area for the created inventory menu
			//	column and row are for the size of the matrix when placing objects from objList
			//	exitString is the string necessary to make the button that allows the player to close the menu
			//	objList is the list of objects that should be created for viewing/selecting
			//	func is the function that should be executed for the function
			
			var inven = {
				//	Create an object that will hold all info for creating a menu
				
				background : null,
				
				text : null,
				
				exit : null,
				
				buttons : [],
				
				destroy : function(){
					this.background.destroy();
					this.text.destroy();
					this.exit.destroy();
					for (var i = 0; i < this.buttons.length; i++){
						if (this.buttons[i].image != null){
							this.buttons[i].image.destroy();
						}
					}
				}
			}
			
			var graphics = game.add.graphics();
			graphics.fixedToCamera = true;
			graphics.beginFill(0x969FBA);
			
			//	Create background for inventory menu
			inven.background = graphics.drawRoundedRect(startx, starty, endx - startx, endy - starty, 9);
			
			var style = { font: "25px Verdana", fill: "#000000", align: "center" };
			inven.text = game.add.text( startx, starty, "Amount: ", style );
			inven.text.fixedToCamera = true;
			
			//	Create a button for closing the menu
			inven.exit = game.add.sprite(0, 0, exitString);
			var exitBuff = inven.exit.width/2;
			inven.exit.x = endx - (exitBuff * 3);
			inven.exit.y = starty + exitBuff;
			inven.exit.fixedToCamera = true;
			inven.exit.inputEnabled = true;
			
			//	Create all the button objects in the menu
			var forCalc = game.add.sprite(0, 0, objList[0].name);	//	Not actually used
			var objWidth = forCalc.width/2;
			var overallWidth = column * objWidth;
			var objHeight = forCalc.height/2;
			var overallHeight = row * objHeight;
			var objStartX = ((endx + startx)/2) - (overallWidth/2);
			var objStartY = ((endy + starty)/2) - (overallHeight/2);
			var it = 0;
			
			//	Done with calculations, free this
			forCalc.destroy();
			
			graphics.endFill();
			graphics.lineStyle(2, 0x000000);
			
			for (var i = 0; i < row; i++){
				//	Move through the rows
				for (var j = 0; j < column; j++){
					//	Move through the columns
					var button = {
						
						image : null,
						
						object : null,
						
						frame: null,
						
						func : null
					}
					var placex = objStartX + (j * objWidth);
					var placey = objStartY + (i * objHeight);
					
					if (it < objList.length){
						button.image = game.add.sprite(placex, placey, objList[it].name);
						button.image.width = objWidth;
						button.image.height = objHeight;
						button.image.fixedToCamera = true;
						button.image.inputEnabled = true;
					}
					
					button.object = objList[it];
					
					button.frame = graphics.drawRect(placex, placey, objWidth, objHeight);
					
					button.func = func;
					
					inven.buttons.push(button);
					it++;
				}
			}
			
			graphics.endFill();
			
			return inven;
		},
		
		checkValidPlace : function(tile){
			//	Check if the placement is valid or not
			//	tile is the tile the player has tried to place an object on
			if (tile.index <= 6){
				//	World barrier and not valid
				return false;
			}
			if (tile.index >= 8){
				//	Exit to other areas and not valid
				return false;
			}
			if (this.player.map[tile.x - 1][tile.y - 1] != null){
				//	Object was already there
				return false;
			}
			return true;
		}
		
	};
	
	game.state.add( 'Boot', GameStates.makeBoot( game ) );
	game.state.add( 'Preloader', GameStates.makePreloader( game ) );
	game.state.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	game.state.add( 'Game', GameStates.makeGame( game, shared ) );

	//	Now start the Boot state.
	game.state.start('Boot');

};
