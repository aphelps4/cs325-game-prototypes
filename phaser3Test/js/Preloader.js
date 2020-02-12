"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;
	
	var titleMusic = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            background = this.add.sprite(0, 0, 'preloaderBackground').setOrigin(0, 0);
            preloadBar = this.add.sprite(300, 400, 'preloaderBar').setOrigin(0, 0);
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            //game.load.setPreloadSprite(preloadBar);
			this.load.on('progress', function (value){
				//preloadBar.setScale(value, 1);
				//	value is a number ranging from [0,1] that holds the percentage of loaded assets
				//	multiply with width to get an idea of how far along the bar should be when loading
				preloadBar.setCrop(0, 0, preloadBar.width * value, preloadBar.height);
			});
    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            this.load.image('titlePage', 'assets/title.jpg');
            this.load.atlas('playButton', 'assets/play_button.png', 'assets/play_button.json');
            this.load.audio('titleMusic', ['assets/Poppers and Prosecco.mp3']);
            //	+ lots of other required assets here
            this.load.image( 'logo', 'assets/phaser.png' );
			
			this.load.on('complete', function (){
				//	Finished loading here
			});
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            //preloadBar.cropEnabled = false;
			console.log("preloader");
			//	titleMusic = this.sound.add('titleMusic');
			//	titleMusic.play();
			//game.scene.start("MainMenu");
    
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            //if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            //{
                //ready = true;
                //game.state.start('MainMenu');
            //}
			this.scene.start("MainMenu");
    
        }
    
    };
};
