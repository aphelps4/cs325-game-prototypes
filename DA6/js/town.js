"use strict";

GameStates.makeTown = function( game, shared ) {

	var music = null;
	var playButton = null;
	var menu = null;
	
	var menuData = {
		
		menuButtons : [
		
		'restButton',
	
		'forestButton'
		
		],
	
		buttonFunctions : [
		
			function(){
				//	This is the function for healing the party
				for (var i = 0; i < shared.state.teamPlace; i++){
					shared.state.team[i].healthLeft = shared.state.team[i].hp;
				}
			},
		
			function(){
				//	This is the function for going into the forest.
				menu.destroy();
				music.stop();
				music = game.add.audio('menuMusic');
				music.loop = true;
				music.play();
				game.state.start('Forest1');
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
    
            music = game.add.audio('townMusic');
			music.loop = true;
            music.play();
    
            game.add.sprite(0, 0, 'townBackground');
    
            menu = shared.openMenu(0, 0, 600, null, 66, 0, 20, menuData);
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
