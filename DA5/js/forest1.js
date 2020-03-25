"use strict";

GameStates.makeForest1 = function( game, shared, dungeon ) {
    // Create your own variables.
    var map = null;
	var tileset = null;
	var layer = null;
	var tileSize = 200;
	
	var enemyList = [];
	var rndmAmtData = {
		
		amtMin : 1,
		
		amtMax : 3,
		
		prob : [50, 30, 20]
		
	}
	var plcmntData = {
		
		back : 0,
		
		front : 30,
		
		width : 180 //	May be wrong, check later
		
	}
	
	var cursors = null;
	var pointer = null;
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            //	Change the background color to look grassy
			game.stage.backgroundColor = "0x4BC421";
			
			//	code for Phaser grid movement example
			map = game.add.tilemap('map', tileSize, tileSize);
			tileset = map.addTilesetImage('tiles', null, tileSize, tileSize);
			layer = map.createLayer(0);
			layer.resizeWorld();
			
			dungeon.initializePlayer(300, 300, 'overWorldWolf');
			dungeon.player.height = tileSize;
			dungeon.player.width = tileSize;
			dungeon.player.anchor.setTo(0.5, 0.5);
			
			game.camera.follow(dungeon.player);
			
			//	Phaser.Input.Keyboard.JustDown for when you want just one press registered
			cursors = game.input.keyboard.createCursorKeys();
			pointer = game.input.activePointer;
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            dungeon.move(cursors, "does not matter: not used", map, tileSize, "not used");
			
			dungeon.moveTimer++;
        }
    };
};
