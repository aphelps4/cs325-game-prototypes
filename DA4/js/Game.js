"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	
	var map = null;
	var tileset = null;
	var layer = null;
	
	var player = null;
	var moveSpeed = 3;
	
	var menu = null;
	var menuList = ['place', 'build'];
	var menuObjList = null;
	var tools = null;
	
	var cursors = null;
    
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
			
			//	Add player
			player = game.add.sprite(150, 150, 'placeholder', 0);
			player.anchor.setTo(0.5, 0.5);
			
			//	Set up menus
			var background = game.add.sprite(0, 520, 'buttonBackground', 0);
			menu = game.add.sprite(0, 520, 'menu', 0);
			menu.inputEnabled = true;
			menu.background = background;
			menu.background.fixedToCamera = true;
			menu.fixedToCamera = true;
			//background = game.add.sprite(720, 520, 'buttonBackground', 0);
			//tools = game.add.sprite(0, 720, 'tools', 0);
			
			game.camera.follow(player);
			
			cursors = game.input.keyboard.createCursorKeys();
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
			
			shared.move(cursors, player, moveSpeed);
			
			shared.cursorOver(menu)
			
			if (menuObjList != null){
				var len = menuObjList.length;
				
				for (var i = 0; i < len; i++){
					shared.cursorOver(menuObjList[i]);
				}
			}
			
			if (game.input.activePointer.justPressed(30)){
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
			}
        }
    };
};
