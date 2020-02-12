"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	//var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );
	var config = {
		parent: "game",
		type: Phaser.AUTO,
		width: 800,
		height: 600
		//disableContextMenu: true
	};
	
	var game = new Phaser.Game(config);

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	
	// An object for shared variables, so that them main menu can show
	// the high score if you want.
	var shared = {};
	var shareTest = "hi";
	
	game.scene.add( 'Boot', GameStates.makeBoot( game ) );
	game.scene.add( 'Preloader', GameStates.makePreloader( game ) );
	//	shared is put in with MainMenu and Game
	game.scene.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	game.scene.add( 'Game', GameStates.makeGame( game, shared ) );

	//	Now start the Boot state.
	//	Put in any variables that should be carried over into the game
	game.scene.start('Boot', {testing: shareTest});

};
