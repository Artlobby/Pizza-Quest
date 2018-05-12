"use strict";
var app = app || {};

app.player = function(){

	var player = {};




	player.position = { x : 300, y : 230};		// Current on-screen position
	player.destination = { x : 300, y : 230};	// Position player moves towards (set by clicking on screen)
	player.speedX = 3.5;						// Movement speed of the player in x direction
	player.speedY = 1.5;						// Movement speed of the player in y direction
	player.currentAction = 0;					// Current set action of player
	player.useGiveItem = undefined;				// The item the player has chosen to use with or give to something else
	player.inventory = [];						// The held objects of the player
	player.isWalking = false;					// Whether the player is moving (should change to a player state, for use with animation)
	player.animations = [];						// Holds the player animations
	player.currentAnimation = undefined;		// The current player animation




	player.addToInventory = function(obj){

		// Adds an object to the player's inventory
		// Also a property for whether the object is moused over in the inventory

		var item = {};
		item.object = obj;
		item.mousedOver = false;
		player.inventory.push(item);
		obj.inInventory = true;
	};


	

	player.removeFromInventory = function(objName){

		// Removes an object from the inventory
		// By finding it by name

		for(var n = 0; n < player.inventory.length; ++n){
			if(player.inventory[n].object.name == objName){
				player.inventory.splice(n, 1);
				break;
			}
		}
	};




	player.update = function(ctx, game, dialogue){
		if(game.gameState == game.GAME_STATE.GAMEPLAY){
			// If the game is currently in the GAMEPLAY state,
			// the player will walk
			player.move();
		}

		// Animates the player
		player.animate(dialogue);

		// If the player is not walking, this function will be called
		// It is usually empty, but when the player initiates an action,
		// this function will take that action once the player has reached their target
		if(player.isWalking == false)
			player.currentActionFunction();
	};

	


	player.move = function(){

		// If the player has not reached their destination
		// Moves the player towards the destination

		if(player.position.x != player.destination.x ||
		player.position.y != player.destination.y){

			player.isWalking = true;

			if(Math.abs(player.destination.x - player.position.x) < player.speedX)
				player.position.x = player.destination.x;
			else {
				if (player.destination.x - player.position.x > 0) 
					player.position.x += player.speedX;
				else
					player.position.x -= player.speedX;
			}

			if(Math.abs(player.destination.y - player.position.y) < player.speedY)
				player.position.y = player.destination.y;
			else {
				if (player.destination.y - player.position.y > 0) 
					player.position.y += player.speedY;
				else
					player.position.y -= player.speedY;
			}

		} else {
			player.isWalking = false;
		}
	};




	player.animate = function(dialogue){

		// Uses 0, 1, and -1 to determine what direction the player is moving on each axis
		var x = 0;
		var y = 0;
		if(player.destination.x - player.position.x > 0) x = 1;
		if(player.destination.x - player.position.x < 0) x = -1;
		if(player.destination.y - player.position.y > 0) y = 1;
		if(player.destination.y - player.position.y < 0) y = -1;

		// Selects a walking animation for the player based on the above direction
		if(y == 0){
			if(x > 0) player.currentAnimation =  player.animations[player.animNames.WALK_RIGHT];
			else player.currentAnimation =  player.animations[player.animNames.WALK_LEFT];
		}
		else if(y > 0) player.currentAnimation =  player.animations[player.animNames.WALK_DOWN];
		else player.currentAnimation =  player.animations[player.animNames.WALK_UP];

		// If the player isn't walking (or dialogue is happening), selects the idle animation
		if(player.isWalking== false)
			player.currentAnimation = player.animations[player.animNames.IDLE];
		if(dialogue.lines.length > 0 || dialogue.discourseOptions != undefined){
			player.currentAnimation = player.animations[player.animNames.IDLE];
		}

		// If the player is speaking, selects the talking animation
		if(dialogue.lines.length > 0 &&
			dialogue.lines[0].character == 0)
			player.currentAnimation = player.animations[player.animNames.TALK];
		
	};




	player.draw = function(ctx, drawList, DrawListObj){

		// Adds the player's draw function to the draw list
		// The draw list draws all onscreen objects with consideration to
		// their z position in space.

		var func = function(){
			player.currentAnimation.draw(ctx, player.position.x, player.position.y);
		};

		drawList.push(new DrawListObj(player.position.y, func));
	};



	// The enumerator for player animations
	player.animNames = Object.freeze({
		IDLE 		: 0,
		WALK_DOWN 	: 1,
		WALK_UP 	: 2,
		WALK_RIGHT 	: 3,
		WALK_LEFT 	: 4,
		TALK		: 5
	});




	// Takes a function when the player sets an action,
	// to be run once the player reaches their action's target
	player.currentActionFunction = function(){};




	return player;

} ();