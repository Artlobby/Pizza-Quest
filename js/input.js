"use strict";
var app = app || {};

app.input = function(){
	var input = {};




	input.mouse = {};		// The mouse position on the screen






	input.mouseMove = function(e){
		// Sets the mouse position
		input.mouse.x = e.pageX - e.target.offsetLeft;
		input.mouse.y = e.pageY - e.target.offsetTop;
	};






	input.mouseClick = function(e){
		
		// CLICKING DURING GAMEPLAY
		if(this.game.gameState == this.game.GAME_STATE.GAMEPLAY){

			// If the mouse is in the Play Area
			if(input.mouse.y < this.ui.bottomBound){

				// If the current action is not LOOK AT or TALK TO
				// (which don't require the player to move over to the target to perform)
				// The player moves over to where the mouse clicked
				if(this.player.currentAction != this.PLAYER_ACTION.LOOK_AT &&
					this.player.currentAction != this.PLAYER_ACTION.TALK_TO &&
					this.player.currentAction != this.PLAYER_ACTION.GIVE){

					this.player.destination.x = input.mouse.x;
					this.player.destination.y = input.mouse.y;

					// Keeps player in boundaries
					var scene = this.scene.scenes[this.scene.currentScene];
					if(this.player.destination.x < scene.xMin)
						this.player.destination.x = scene.xMin;
					if(this.player.destination.x > scene.xMax)
						this.player.destination.x = scene.xMax;
					if(this.player.destination.y < scene.yMin)
						this.player.destination.y = scene.yMin;
					if(this.player.destination.y > scene.yMax)
						this.player.destination.y = scene.yMax;
				}
		
				// If no objects were clicked on,
				// Whatever the current action is is cancelled and removed from the focus text
				// If the player happened to be moving somewhereto perform an action,
				// that is cancelled as well.
				if(this.objects.clickObjects(this.dialogue, this.player) == false){
					this.player.currentAction = this.PLAYER_ACTION.NONE;
					this.ui.focusText = "";
					this.player.useGiveItem = undefined;
					this.player.currentActionFunction = function(){};
				}

			}

			// Checks if the UI was clicked and takes the necessary actions over on the UI side
			// If no UI elements were clicked, cancels the current action
			else if(this.ui.checkUIClick(this.player, this.dialogue, this.objects) == false){
				this.player.currentAction = this.PLAYER_ACTION.NONE;
				this.ui.focusText = "";
				this.player.useGiveItem = undefined;
			}

		// CLICKING DURING DIALOGUE
		} else if(this.game.gameState == this.game.GAME_STATE.DIALOGUE){
			
			// If dialogue is being spoken
			// (meaning there are lines of dialogue in the array for that)
			// Removes the current line of dialogue when clicked
			// to move on to the next one
			if(this.dialogue.lines.length > 0)
				this.dialogue.lines.splice(0,1);

			// If the player is given a choice of dialogue
			else {

				// If the player clicks on the Play Area, outside of the UI
				// Cancels the talking interaction
				//if(input.mouse.y < this.ui.bottomBound)
				//	this.dialogue.discourseOptions = undefined;

				// If the player clicks in the UI,
				// Checks if they've chosen a line of dialogue and takes appropriate action
				//else
					this.dialogue.converseClick();
			}
		} else if (this.game.gameState == this.game.GAME_STATE.MENU){
			this.startMenu.click(this.ctx, this.player, GetObject(this.objects.list, "Mackenzie"), this.game);
		}
	};









	input.onKeyUp = function(e){

		var char = String.fromCharCode(e.keyCode);

		// Keyboard controls set Actions.
		// Controls based on Indiana Jones and the Fate of Atlantis
		// Key Daemon not necessary for this game
		//	But if it were, it would require simply adding a KeyDown event
		//	 and an array of key states, like in Boomshine

		var setAction = function(string, action){
			this.player.currentAction = action;
			this.ui.focusText = string;
			this.player.useGiveItem = undefined;
		}.bind(this);

		switch (char){
			case 'G':
				setAction("Give", this.PLAYER_ACTION.GIVE);
				break;
			case 'O':
				setAction("Open", this.PLAYER_ACTION.OPEN);
				break;
			case 'C':
				setAction("Close", this.PLAYER_ACTION.CLOSE);
				break;
			case 'P':
				setAction("Pick Up", this.PLAYER_ACTION.PICK_UP);
				break;
			case 'T':
				setAction("Talk To", this.PLAYER_ACTION.TALK_TO);
				break;
			case 'L':
				setAction("Look At", this.PLAYER_ACTION.LOOK_AT);
				break;
			case 'U':
				setAction("Use", this.PLAYER_ACTION.USE);
				break;
			case 'S':
				setAction("Push", this.PLAYER_ACTION.PUSH);
				break;
			case 'Y':
				setAction("Pull", this.PLAYER_ACTION.PULL);
				break;
		}
	};













	// Touch controls
	// Moving and releasing a touch moves the mouse position
	// Releasing a touch acts as a click
	// When touching the canvas, default behavior such as scrolling is disabled

	input.touchMove = function(e){
		var touch = e.touches[0];
		input.mouse.x = touch.clientX - e.target.offsetLeft;;
		input.mouse.y = touch.clientY - e.target.offsetTop;;
	};
	input.touchEnd = function(e){
		input.touchMove(e);
		input.mouseClick(e);
	};
	input.touchInit = function(){
		this.canvas.addEventListener("touchstart", function (e) {
			e.preventDefault();
		});
		this.canvas.addEventListener("touchend", function (e) {
			e.preventDefault();
		});
		this.canvas.addEventListener("touchmove", function (e) {
			e.preventDefault();
		});
	};


	



	return input;

}();





