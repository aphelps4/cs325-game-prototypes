GameStates.makeLose = function ( game ){
	
	return {
		create: function(){
			game.add.sprite(0, 0, 'loseScreen');
		},
		
		update: function(){
			
			if (game.input.activePointer.isDown){
				game.state.start('MainMenu');
			}
		}
	}
}