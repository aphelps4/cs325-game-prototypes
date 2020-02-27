"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            preloadBar = game.add.sprite(200, 300, 'preload');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
    
            //	+ lots of other required assets here
			
			game.load.audio('Cat', ['assets/Cat.wav']);
			game.load.audio('meow1', ['assets/meow1.wav']);
			game.load.audio('meow2', ['assets/meow2.wav']);
			game.load.audio('meow3', ['assets/meow3.wav']);
			
			game.load.image('storefront', 'assets/storefront.png');
			game.load.atlas('start', 'assets/start.png', 'assets/play_button.json');
			
			game.load.image('cafeBackground', 'assets/cafeBackground.png');
			game.load.image('cannon', 'assets/cannon.png');
			game.load.image('cat1', 'assets/cat1.png');
			game.load.image('catHitBox', 'assets/catHitBox.png');
			game.load.image('catHead', 'assets/catHead.png');
			game.load.spritesheet('catBed', 'assets/catBed.png', 80, 60);
			
			game.load.image('loseScreen', 'assets/loseScreen.png');
			game.load.image('winScreen', 'assets/winScreen.png');
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
            
            if (game.cache.isSoundDecoded('Cat') && game.cache.isSoundDecoded('meow1') && game.cache.isSoundDecoded('meow2') && game.cache.isSoundDecoded('meow3') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
