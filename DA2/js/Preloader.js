"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            background = game.add.sprite(0, 0, 'preloaderBackground');
            preloadBar = game.add.sprite(300, 400, 'preloaderBar');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            game.load.atlas('playButton', 'assets/play_button.png', 'assets/play_button.json');
			
			game.load.audio('gameMusic', ['assets/Passage.wav']);
			
			//	Main character
			game.load.spritesheet('MC', 'assets/mainCharacterWalk.png', 60, 160);
			
			//	Area
			game.load.image('ground', 'assets/floorTile.png');
			game.load.tilemap('floor1', 'assets/floor1.csv', null, Phaser.Tilemap.CSV);
			game.load.image('portal', 'assets/portal.png');
			game.load.image('upArrowPrompt', 'assets/upArrowPrompt.png');
			game.load.image('fog', 'assets/fog.png');
			game.load.image('light', 'assets/light.png');
			game.load.image('end', 'assets/endScreen.png');
			game.load.image('begin', 'assets/beginScreen.png');
			
			//	Puzzle
			game.load.spritesheet('card1', 'assets/card1.png', 75, 100);
			game.load.spritesheet('card2', 'assets/card2.png', 75, 100);
			game.load.spritesheet('card3', 'assets/card3.png', 75, 100);
			game.load.spritesheet('card4', 'assets/card4.png', 75, 100);
			game.load.spritesheet('card5', 'assets/card5.png', 75, 100);
			game.load.spritesheet('cardFinal', 'assets/cardFinal.png', 75, 100);
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
            
            if (game.cache.isSoundDecoded('gameMusic') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
