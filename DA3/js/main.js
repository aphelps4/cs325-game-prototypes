"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	
	// An object for shared variables, so that the main menu can show
	// the high score if you want.
	var shared = {
		
		score : 0,
		
		rotateToMouse : function(object){
			//	Rotate the object to follow the mouse
			
			object.rotation = game.physics.arcade.angleToPointer(object, game.input.activePointer);
		},
		
		shoot : function(shooter, toShoot){
			//	shooter is the object that will be shooting something
			//	toShoot is the object that will be shot from the shooter
			
			var velocity = 500;
			toShoot.x = shooter.x;
			toShoot.y = shooter.y;
			toShoot.angle = shooter.angle;
			toShoot.allowGravity = true;
			toShoot.body.velocity.x = Math.cos(toShoot.rotation) * velocity;
			toShoot.body.velocity.y = Math.sin(toShoot.rotation) * velocity;
			toShoot.body.gravity.y = 250;
			return toShoot;
		},
		
		makeBeds : function(group, beds, outBuffer, inBuffer, fromBottom, lines, xsize, ysize, chooseLines){
			//	group is the group where the objects are placed, beds is the object string for placement,
			//	outBuffer is the buffer from the edges of the screen, inBuffer is buffer from middle
			//	fromBottom is how far from the bottom you should start drawing lines
			//	lines is how many lines you can fit in the section (there are always four sections)
			//	xsize is size of canvas for x axis and ysize is size of canvas for y axis
			//	chooseLines is how many of the lines you want to use when finding spaces
			
			var xMid = xsize/2;
			var yMid = ysize/2;
			
			for (var i = 0; i < 4; i++){
				//	Loop through the four sections
				//	section 0: upper left, section 1: upper right, section 2: lower left, section 3: lower right
				
				//	Calculate the availble placement for y
				var yStart = 0;
				//	yStart is for generating random number, this changes based on section so calculate it
				if (i < 2){
					//	i is in first two sections therefore it is above the split
					yStart = ysize;
				}
				else{
					//	i is in the second two sections therefore it is below the split
					yStart = yMid - 1;
				}
				var lineChoice = [];
				lineChoice.length = lines;
				for (var j = 1; j <= lines; j++){
					//	Create the options for randomly choosing line for beds
					lineChoice[j - 1] = j;
				}
				for (var j = 0; j < chooseLines; j++){
					
					//	Create the object we are putting in place
					var child = game.add.sprite(0, ysize, beds, 0);
					child.anchor.setTo(0, 1);
					game.physics.enable(child, Phaser.Physics.ARCADE);
					
					//	Calculate the availble placement for x
					var xStart = 0;
					var xEnd = 0;
					//	xStart and xEnd are for generating random number, this changes based on section so calculate it
					if (i % 2 == 0){
						//	i is even therefore we are to the left of the split
						xStart = 0;
						xStart += outBuffer;
						xEnd = xMid - 1;
						xEnd -= inBuffer;
						xEnd -= child.width;
					}
					else{
						//	i is odd therefore we are to the right of the split
						xStart = xMid;
						xStart += inBuffer;
						xEnd = xsize;
						xEnd -= outBuffer;
						xEnd -= child.width;
					}
					//	Place the object somewhere between the available area
					child.x = game.rnd.between(xStart, xEnd);
					
					//	Randomly choose from the available lines
					var choice = lineChoice.splice(game.rnd.between(0, lineChoice.length - 1), 1);
					child.y = yStart - (choice * fromBottom);
					
					//	Child has been placed so add it to group now
					group.addChild(child);
				}
			}
		},
		
		catInBed : function(child, shotObject, parent){
			//	child is a child of a group that should check for overlap
			//	shotObject is the object that should overlap child
			
			//	child is the object we are checking with overlap with shotObject
			if (child.frame == 0){
				//	Bed is empty when frame is zero
				if (game.physics.arcade.collide(shotObject, child)){
					//	shotObject is over the goal
					child.frame = 1;
					//	Make the parent (which the hit box "shotObject" is attached to) stop moving
					parent.body.gravity.y = 0;
					parent.body.velocity.x = 0;
					parent.body.velocity.y = 0;
					parent.x = -100;
					parent.y = -100;
					parent.takeOne = false;
				}
			}
		},
		
		objectOut : function(shotObject){
			//Check if the shotObject is out of bounds everywhere except up
			var leftXBounds = 0 - (shotObject.width/2);
			var rightXBounds = game.world.width + (shotObject.width/2);
			var downYBounds = game.world.height + (shotObject.height/2);
			if (shotObject.worldPosition.x < leftXBounds){
				//	Out of bounds left
				return true;
			}
			if (shotObject.worldPosition.x > rightXBounds){
				//	Out of bounds right
				return true;
			}
			if (shotObject.worldPosition.y > downYBounds){
				//	Out of bounds down
				return true;
			}
			return false;
		}
	};
	
	game.state.add( 'Boot', GameStates.makeBoot( game ) );
	game.state.add( 'Preloader', GameStates.makePreloader( game ) );
	game.state.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	game.state.add( 'Floor1', GameStates.makeFloor1( game, shared ) );

	//	Now start the Boot state.
	game.state.start('Boot');

};
