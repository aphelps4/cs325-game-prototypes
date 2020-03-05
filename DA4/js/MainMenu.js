"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music = null;
	var title = null;
	var playButton = null;
    
    function startGame(pointer) {

        //	And start the actual game
        game.state.start('Game');

    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            music = game.add.audio('MasterCrafter');
			music.loop = true;
            music.play();
			
			title = game.add.image(200, 50, 'title');
    
            playButton = game.add.button( 303, 400, 'start', startGame, null, 'over', 'out', 'down');
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
