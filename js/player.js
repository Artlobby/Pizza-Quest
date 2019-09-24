"use strict";

const player = (function(){

	const ACTIONS = Object.freeze({
		NONE 		: 0,
		LOOK_AT 	: 1,
		USE 		: 2,
		PICK_UP 	: 3,
		PUSH 		: 4,
		PULL 		: 5,
		GIVE 		: 6,
		TALK_TO 	: 7,
		OPEN 		: 8,
		CLOSE 		: 9
	});




	let position 			= { x : 300, y : 230 };	// Current on-screen position
	let destination			= { x : 300, y : 230 };	// Position player moves towards (set by clicking on screen)
	console.log("TODO: Wrap position and destination in getters and setters?");
	const inventory 		= [];					// The held objects of the player
	console.log("TODO: Shut away inventory completely");
	const animations 		= [];					// Holds the player animations
	console.log("TODO: Maybe shut away animations completely?");

	const SPEED_X 			= 3.5;					// Movement speed of the player in x direction
	const SPEED_Y 			= 1.5;					// Movement speed of the player in y direction

	let _isWalking 			= false;				// Whether the player is moving (should change to a player state, for use with animation)
	let _currentAnimation 	= undefined;			// The current player animation
	let _currentAction 		= 0;					// Current set action of player
	let _useGiveItem 		= undefined;			// The item the player has chosen to use with or give to something else



	const SetCurrentAction = function(input){
		_currentAction = input;
	}
	const GetCurrentAction = function(){
		return _currentAction;
	}



	const SetUseGiveItem = function(input){
		_useGiveItem = input;
	}
	const GetUseGiveItem = function(){
		return _useGiveItem;
	}




	let _addItem;
	const AddToInventory = function(obj){
		_addItem 			= {};
		_addItem.object 	= obj;
		_addItem.mousedOver = false;
		inventory.push(_addItem);
		obj.inInventory 	= true;
	};


	

	const RemoveFromInventory = function(objName){
		for(let n = 0; n < inventory.length; ++n){
			if(inventory[n].object.name == objName){
				inventory.splice(n, 1);
				break;
			}
		}
	};




	const Update = function(ctx, game, dialogue){
		if(game.gameState == game.GAME_STATE.GAMEPLAY){
			Move();
		}
		
		Animate(dialogue);

		if(_isWalking == false)
			_currentActionFunction();
	};




	const Move = function(){

		// If the player has not reached their destination
		// Moves the player towards the destination

		if(position.x != destination.x ||
		position.y != destination.y){

			_isWalking = true;

			if(Math.abs(destination.x - position.x) < SPEED_X)
				position.x = destination.x;
			else {
				if (destination.x - position.x > 0) 
					position.x += SPEED_X;
				else
					position.x -= SPEED_X;
			}

			if(Math.abs(destination.y - position.y) < SPEED_Y)
				position.y = destination.y;
			else {
				if (destination.y - position.y > 0) 
					position.y += SPEED_Y;
				else
					position.y -= SPEED_Y;
			}

		} else {
			_isWalking = false;
		}
	};




	let _animX;
	let _animY;
	const Animate = function(dialogue){

		// Uses 0, 1, and -1 to determine what direction the player is moving on each axis
		_animX = 0;
		_animY = 0;
		if(destination.x - position.x > 0) _animX = 1;
		if(destination.x - position.x < 0) _animX = -1;
		if(destination.y - position.y > 0) _animY = 1;
		if(destination.y - position.y < 0) _animY = -1;

		// Selects a walking animation for the player based on the above direction
		if(_animY == 0){
			if(_animX > 0) _currentAnimation =  animations[ANIM_NAMES.WALK_RIGHT];
			else _currentAnimation =  animations[ANIM_NAMES.WALK_LEFT];
		}
		else if(_animY > 0) _currentAnimation =  animations[ANIM_NAMES.WALK_DOWN];
		else _currentAnimation =  animations[ANIM_NAMES.WALK_UP];

		// If the player isn't walking (or dialogue is happening), selects the idle animation
		if(_isWalking== false)
			_currentAnimation = animations[ANIM_NAMES.IDLE];
		if(dialogue.lines.length > 0 || dialogue.discourseOptions != undefined){
			_currentAnimation = animations[ANIM_NAMES.IDLE];
		}

		// If the player is speaking, selects the talking animation
		if(dialogue.lines.length > 0 &&
			dialogue.lines[0].character == 0)
			_currentAnimation = animations[ANIM_NAMES.TALK];
		
	};




	const Draw = function(ctx, drawList, DrawListObj){
		let drawFunc = function(){
			_currentAnimation.draw(ctx, position.x, position.y);
		}
		drawList.push(new DrawListObj(position.y, drawFunc));
	};



	// The enumerator for player animations
	const ANIM_NAMES = Object.freeze({
		IDLE 		: 0,
		WALK_DOWN 	: 1,
		WALK_UP 	: 2,
		WALK_RIGHT 	: 3,
		WALK_LEFT 	: 4,
		TALK		: 5
	});




	// Takes a function when the player sets an action,
	// to be run once the player reaches their action's target
	let _currentActionFunction = function(){};
	const SetCurrentActionFunction = function(input){
		_currentActionFunction = input;
	};




	return Object.freeze({
		ACTIONS						: ACTIONS,

		position 					: position,
		destination 				: destination,
		inventory 					: inventory,
		animations 					: animations,

		SetCurrentAction			: SetCurrentAction,
		GetCurrentAction			: GetCurrentAction,
		SetUseGiveItem				: SetUseGiveItem,
		GetUseGiveItem				: GetUseGiveItem,
		AddToInventory 				: AddToInventory,
		RemoveFromInventory 		: RemoveFromInventory,
		Update	 					: Update,
		Draw 						: Draw,
		SetCurrentActionFunction	: SetCurrentActionFunction
	});

})();