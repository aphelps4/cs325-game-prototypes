"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music = null;
	var playButton = null;
	var menu = null;
	
	var menuData = {
		
		menuButtons : [
		
		'continueButton',
	
		'startNewButton'
		
		],
	
		buttonFunctions : [
		
			function(){
				//	This is the function for loading a saved game
				var stateStore = JSON.parse(localStorage.getItem('save'));
				if (stateStore != null){
					//	We go a valid state back so there was a save
					shared.state = stateStore;
					menu.destroy();
					music.stop();
					game.state.start('Town');
				}
			},
		
			function(){
				//	This is the function for starting a new game.
				shared.startNew();
				menu.destroy();
				music.stop();
				game.state.start('Town');
			}
		
		]
		
	}
    
    function startGame(pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		
		shared.load();

        //	And start the actual game
        game.state.start('Forest1');

    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            music = game.add.audio('menuMusic');
			music.loop = true;
            music.play();
    
            game.add.sprite(0, 0, 'titleScreen');
    
            menu = shared.openMenu(0, 180, 600, null, 66, 0, 40, menuData);
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
