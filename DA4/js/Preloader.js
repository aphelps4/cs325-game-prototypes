"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
			game.stage.backgroundColor = 0x7F5B39;
            preloadBar = game.add.sprite(300, 400, 'loading');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            //	+ lots of other required assets here
			game.load.atlas('start', 'assets/start.png', 'assets/play_button.json');
			game.load.audio('MasterCrafter', ['assets/MasterCrafter.wav']);
			game.load.image('title', 'assets/title.png');
			
			//	Player
			game.load.image('player', 'assets/player.png');
			
			//	Menus
			game.load.spritesheet('buttonBackground', 'assets/buttonBackground.png', 80, 80);
			game.load.spritesheet('menu', 'assets/menu.png', 80, 80);
			game.load.spritesheet('place', 'assets/place.png', 80, 80);
			game.load.spritesheet('build', 'assets/build.png', 80, 80);
			game.load.spritesheet('exit', 'assets/exit.png', 30, 30);
			game.load.spritesheet('comingSoon', 'assets/comingSoon.png', 800, 600);
			
			//	Objects
			game.load.spritesheet('table', 'assets/table.png', 100, 100);
			game.load.spritesheet('chair', 'assets/chair.png', 100, 100);
			game.load.spritesheet('chicken', 'assets/chicken.png', 100, 100);
			
			//	Assets for the home area
			game.load.image('tiles', 'assets/homeTiles.png');
			game.load.tilemap('homeMap', 'assets/home.csv', null, Phaser.Tilemap.CSV);
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
            
            if (game.cache.isSoundDecoded('MasterCrafter') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
