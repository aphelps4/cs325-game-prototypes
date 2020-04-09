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
		
	};
	var rndmLvlData = {
		amtMin : 1,
		
		amtMax : 3,
		
		prob : [50, 30, 20]
		
	}
	var plcmntData = {
		
		back : 90,
		
		front : 140,
		
		width : 100 //	May be wrong, check later
		
	};
	var availableEnemies = [
		
		{
			name : 'Rabbit',
			calculateStats : function(lvl){
				//	Takes the character lvl, calculates the stats on it, and returns an enemy object
				//	so we can have multiple of the same type of enemy.
				var object = {
					name : this.name,
					lvl : lvl,
					hp : lvl * 6,
					str : lvl * 2,
					mag : lvl,
					def : lvl,
					spd : lvl * 3,
					sprite : null,
					background : null,
					frame : null
				}
				object.sprite = game.add.sprite(0, 0, 'portraitRabbit', 0);
				object.sprite.anchor.setTo(0, 1);
				return object
			}
		}
	];
	
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
            
            if (dungeon.move(cursors, map, tileSize, 20)){
				//	Random encounter occurred
				dungeon.startBattle(rndmAmtData, rndmLvlData, plcmntData, availableEnemies);
			}
			
			dungeon.moveTimer++;
        }
    };
};
