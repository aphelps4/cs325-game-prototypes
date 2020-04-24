"use strict";

GameStates.makeForest1 = function( game, shared, dungeon ) {
    // Create your own variables.
    var map = null;
	var tileset = null;
	var layer = null;
	var tileSize = 200;
	
	var mapAccess = -1;
	
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
					healthLeft : lvl * 6,
					hp : lvl * 6,
					str : lvl * 2,
					mag : lvl,
					def : lvl,
					spd : lvl * 3,
					sprite : null,
					background : null,
					frame : null,
					statDisplay : null
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
			
			//	Past data is still here, destroy it before overwriting it
			if (map != null){
				map.destroy();
				layer.destroy();
			}
			
			//	Create dungeon for player to move through
			map = game.add.tilemap('forest1Map', tileSize, tileSize);
			tileset = map.addTilesetImage('forest1Tiles', null, tileSize, tileSize);
			layer = map.createLayer(0);
			layer.resizeWorld();
			
			//	Set up map data for this floor
			for (var i = 0; i < shared.state.maps.length; i++){
				//	Loop through player maps and find the one for this floor
				if (shared.state.maps[i].name == 'forest1'){
					//	Found the map, store the number
					mapAccess = i;
				}
			}
			if (mapAccess == -1){
				//	Failed to find the map data
				console.log('Map data not found');
			}
			if (shared.state.maps[mapAccess].data.length == 0){
				//	The maps data has not been initialized yet
				for (var i = 0; i < map.width; i++){
					//	Set the x axis of the map
					var lis = [];
					for (var j = 0; j < map.height; j++){
						//	Set the y axis of the map
						lis.push(0);
					}
					shared.state.maps[mapAccess].data.push(lis);
				}
			}
			
			dungeon.initializePlayer(900, 2700, 'overWorldWolf');
			dungeon.storeNearbyMap(map, mapAccess);
			dungeon.player.height = tileSize;
			dungeon.player.width = tileSize;
			dungeon.player.angle = -90;
			dungeon.player.anchor.setTo(0.5, 0.5);
			
			game.camera.follow(dungeon.player);
			
			//	Phaser.Input.Keyboard.JustDown for when you want just one press registered
			cursors = game.input.keyboard.createCursorKeys();
			pointer = game.input.activePointer;
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
			
			dungeon.enemyInput();
			
			dungeon.battleOver();
            
            if (dungeon.move(cursors, map, mapAccess, tileSize, 10)){
				//	Random encounter occurred
				dungeon.startBattle(rndmAmtData, rndmLvlData, plcmntData, availableEnemies);
			}
			
			dungeon.moveTimer++;
        }
    };
};
