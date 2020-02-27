GameStates.makeWin = function ( game, shared ) {
	
	return {
		create: function(){
			game.add.sprite(0, 0, 'winScreen');
			
			var style = { font: "25px Verdana", fill: "#FF0000", align: "center" };
            var text = game.add.text( 400, 400, "Score: " + shared.score.toString(), style );
			text.anchor.setTo(0.5, 0.5);
		},
		
		update: function(){
			
			/*if (game.input.activePointer.isDown){
				game.state.start('MainMenu');
			}*/
		}
	}
}