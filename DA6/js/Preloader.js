"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            preloadBar = game.add.sprite(190, 400, 'preloaderBar');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
			
			//	Title menu assets
			game.load.image('titleScreen', 'assets/titleScreen.png');
			game.load.atlas('startNewButton', 'assets/startNewButton.png', 'assets/menuButton.json');
    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
			game.load.audio('menuMusic', ['assets/EternalForest.wav']);
            //	+ lots of other required assets here
			
			//	Town assets
			game.load.image('townBackground', 'assets/townBackground.png');
			game.load.atlas('saveButton', 'assets/saveButton.png', 'assets/menuButton.json');
			game.load.atlas('restButton', 'assets/restButton.png', 'assets/menuButton.json');
			game.load.audio('restSound', ['assets/restSound.wav'])
			game.load.atlas('forestButton', 'assets/forestButton.png', 'assets/menuButton.json');
			game.load.audio('townMusic', ['assets/Town.wav']);
			
			//	Dungeon assets
			game.load.spritesheet('overWorldWolf', 'assets/overWorldWolf.png', 156, 156);
			game.load.image('forest1Tiles', 'assets/forest1Tiles.png');
			game.load.tilemap('forest1Map', 'assets/forest1Map.csv', null, Phaser.Tilemap.CSV);
			
			//	Battle assets
			game.load.image('battleBackground', 'assets/battleBackground.png');
			game.load.spritesheet('fightMenu', 'assets/fightMenu.png', 200, 200);
			game.load.atlas('attackButton', 'assets/attackButton.png', 'assets/attackButton.json');
			game.load.spritesheet('portraitBackground', 'assets/portraitBackground.png', 156, 190);
			game.load.spritesheet('portraitFrame', 'assets/portraitFrame.png', 156, 190);
			game.load.spritesheet('portraitWolf', 'assets/portraitWolf.png', 156, 190);
			game.load.spritesheet('portraitRabbit', 'assets/portraitRabbit.png', 156, 190);
			game.load.image('expPage', 'assets/expPage.png');
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
    
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            if (game.cache.isSoundDecoded('menuMusic') && game.cache.isSoundDecoded('townMusic') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
