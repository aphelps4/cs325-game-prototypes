"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music = null;
	var playButton = null;
    
    function startGame(pointer) {

        //	And start the actual game
        game.state.start('Floor1');

    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            if (game.sound.mute){
				//	Sound has been muted only at the beginning to ensure music only plays once
				game.sound.mute = false;
				music = game.add.audio('Cat');
				music.loop = true;
				music.play();
			}
    
            game.add.sprite(0, 0, 'storefront');
    
            playButton = game.add.button( 220, 230, 'start', startGame, null, 'over', 'out', 'down');
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
