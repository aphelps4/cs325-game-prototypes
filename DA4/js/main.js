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
		
		move : function(cursors, player, moveSpeed){
			
			if (cursors.left.isDown){
				//	Go left
				player.x -= moveSpeed;
			}
			else if (cursors.right.isDown){
				//	Go right
				player.x += moveSpeed;
			}
			else if (cursors.up.isDown){
				//	Go up
				player.y -= moveSpeed;
			}
			else if (cursors.down.isDown){
				//	Go down
				player.y += moveSpeed;
			}
		},
		
		cursorOver : function (button){
			
			if (button.input.pointerOver()){
				button.background.frame = 1;
			}
			else{
				button.background.frame = 0;
			}
		},
		
		openMenu : function (menuObj, menuList, buttonBackground){
			
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
			
			menuObj.frame = 0;
			
			var listLen = menuObjList.length;
			for (var i = 0; i < listLen; i++){
				menuObjList[i].background.destroy();
				menuObjList[i].destroy();
			}
			
			return null;
		}
		
	};
	
	game.state.add( 'Boot', GameStates.makeBoot( game ) );
	game.state.add( 'Preloader', GameStates.makePreloader( game ) );
	game.state.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	game.state.add( 'Game', GameStates.makeGame( game, shared ) );

	//	Now start the Boot state.
	game.state.start('Boot');

};
