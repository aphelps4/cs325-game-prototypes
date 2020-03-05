"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	
	var map = null;
	var tileset = null;
	var layer = null;
	
	var moveSpeed = 3;
	
	var menu = null;
	var menuList = ['place', 'build'];
	var menuObjList = null;
	var tools = null;
	var inven = null;
	var objList = ['table'];
	
	var hoverCt = 0;
	
	var place = null;
	var objectStore = null;
	
	var buildInfo = null;
	
	var cursors = null;
	
	var placeFunc = function(object, text){
		//	object is the object that is being placed
		//	text is the text that shows the amount of any object when a player hovers over it
		
		if (object.image.input.pointerOver()){
			//	Player is hovering over a button
			text.text = "Amount: " + object.object.storeNum;
			hoverCt++;
			
			if (game.input.activePointer.justPressed(30)){
				//	Button was clicked therefore the player will start placing their object
				if (object.object.storeNum > 0){
					//	The player has at least one object to place
					place = object.object.name;
					place = game.add.sprite(0, 0, place);
					objectStore = object.object;
					inven.destroy();
					inven = null;
				}
			}
		}
	}
	
	var buildFunc = function(object, text){
		//	object is the object that is being built
		//	text is the text that shows the amount of any object when a player hovers over it
		
		var need = object.object.resourcesNeed;
		var have = shared.player.resources;
		
		if (object.image.input.pointerOver()){
			//	Player is hovering over a button
			text.text = "Amount: " + object.object.storeNum;
			hoverCt++;
			if (buildInfo == null){
				buildInfo = shared.openInv(400, 80, 720, 520, 0, 0, null, shared.player.objList);
			}
			
			buildInfo.text.text = "Resources needed: " + need.toString() + "\nResources have: " + have.toString();
			
			if (game.input.activePointer.justPressed(30)){
				//	Button was clicked therefore object was created
				object.object.storeNum++;
				shared.player.resources -= need;
			}
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
            
            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            text.anchor.setTo( 0.5, 0.0 );
			
			//	Set up map
			map = game.add.tilemap('homeMap', 100, 100);
			tileset = map.addTilesetImage('tiles', null, 100, 100);
			layer = map.createLayer(0);
			layer.resizeWorld();
			
			//	Initialize the game
			shared.initializeGame();
			
			//	Set up menus
			var background = game.add.sprite(0, 520, 'buttonBackground', 0);
			menu = game.add.sprite(0, 520, 'menu', 0);
			menu.inputEnabled = true;
			menu.background = background;
			menu.background.fixedToCamera = true;
			menu.fixedToCamera = true;
			//background = game.add.sprite(720, 520, 'buttonBackground', 0);
			//tools = game.add.sprite(0, 720, 'tools', 0);
			
			game.camera.follow(shared.player.sprite);
			
			cursors = game.input.keyboard.createCursorKeys();
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
			
			var checkFirst = shared.move(cursors, shared.player.sprite, moveSpeed, map, inven);
			
			shared.cursorOver(menu)
			
			if (menuObjList != null){
				//	Menu has been opened
				
				var len = menuObjList.length;
				
				for (var i = 0; i < len; i++){
					shared.cursorOver(menuObjList[i]);
				}
				
				if (game.input.activePointer.justPressed(30)){
					if (menuObjList[0].input.pointerOver()){
						//	The place option was pressed
						inven = shared.openInv(80, 80, 720, 520, 10, 6, 'exit', shared.player.objList, placeFunc);
						menuObjList = shared.closeMenu(menu, menuObjList);
						menu.visible = false;
						menu.background.visible = false;
					}
					else if (menuObjList[1].input.pointerOver()){
						//	The build option was pressed
						inven = shared.openInv(80, 80, 400, 520, 4, 6, 'exit', shared.player.objList, buildFunc);
						menuObjList = shared.closeMenu(menu, menuObjList);
						menu.visible = false;
						menu.background.visible = false;
					}
				}
			}
			
			if (game.input.activePointer.justPressed(30)){
				//	Player has clicked, check if there was a valid action
				
				if (menu.input.pointerOver()){
					//	Open the main menu
					if (menu.frame == 0){
						//	Menu has not been opened yet
						menuObjList = shared.openMenu(menu, menuList, 'buttonBackground');
					}
					else{
						//	Menu was already open
						menuObjList = shared.closeMenu(menu, menuObjList);
					}
				}
				
				if (place != null){
					//	Player has tried to place an object
					var overTile = map.getTileWorldXY(game.input.activePointer.worldX, game.input.activePointer.worldY);
					if (shared.checkValidPlace(overTile)){
						//	Player chose a valid spot
						shared.player.map[overTile.x - 1][overTile.y - 1] = place;
						objectStore.storeNum--;
						place = null;
						objectStore = null;
						menu.visible = true;
						menu.background.visible = true;
					}
				}
				
				if (inven != null){
					//	An inventory menu is open
					if (inven.exit.input.pointerOver()){
						//	Check for the player hitting the close button
						inven.destroy();
						inven = null;
						menu.visible = true;
						menu.background.visible = true;
					}
				}
			}
			
			if (inven != null){
				//Check all the buttons in the inventory menu for input
				hoverCt = 0;
				//for (var i = 0; i < inven.buttons.length; i++){
				for (var i = 0; i < shared.player.objList.length; i++){
					if (inven != null){
						if (inven.buttons[i] != null){
							if (inven.buttons[i].object != null){
								//	Some buttons have no object with them
								inven.buttons[i].func(inven.buttons[i], inven.text);
							}
						}
					}
				}
				
				if (hoverCt == 0){
					//	Player is not over any objects
					inven.text.text = "Amount: ";
				}
			}
			else{
				inven = checkFirst;
			}
			
			if (buildInfo != null){
				//	We are displaying build info
				if (hoverCt == 0){
					//	Player is not over any objects
					buildInfo.destroy();
					buildInfo = null;
				}
			}
			
			if (place != null){
				//	Player is trying to place an object, show them where it will go
				var overTile = map.getTileWorldXY(game.input.activePointer.worldX, game.input.activePointer.worldY);
				place.position.x = overTile.worldX;
				place.position.y = overTile.worldY;
			}
        }
    };
};
