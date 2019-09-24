"use strict";

const input = function(){


	mouse = {};		// The mouse position on the screen




	Init = function(canvas){
		canvas.onmousemove = MouseMove;
		canvas.onmousedown = MouseClick;
		window.addEventListener("keyup", 		OnKeyUp);
		TouchInit(canvas);
		canvas.addEventListener("touchstart", 	TouchMove);
		canvas.addEventListener("touchmove", 	TouchMove);
		canvas.addEventListener("touchend", 	MouseClick);
	}




	const MouseMove = function(e){
		// Sets the mouse position
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;
	};






	const MouseClick = function(e){
		
		// CLICKING DURING GAMEPLAY
		if(game.gameState == game.GAME_STATE.GAMEPLAY){

			// If the mouse is in the Play Area
			if(mouse.y < ui.BOTTOM_BOUND){

				// If the current action is not LOOK AT or TALK TO
				// (which don't require the player to move over to the target to perform)
				// The player moves over to where the mouse clicked
				if(player.currentAction != player.ACTIONS.LOOK_AT &&
					player.currentAction != player.ACTIONS.TALK_TO &&
					player.currentAction != player.ACTIONS.GIVE){

					player.destination.x = mouse.x;
					player.destination.y = mouse.y;

					// Keeps player in boundaries
					let scene = scene.scenes[scene.currentScene];
					if(player.destination.x < scene.xMin)
						player.destination.x = scene.xMin;
					if(player.destination.x > scene.xMax)
						player.destination.x = scene.xMax;
					if(player.destination.y < scene.yMin)
						player.destination.y = scene.yMin;
					if(player.destination.y > scene.yMax)
						player.destination.y = scene.yMax;
				}
		
				// If no objects were clicked on,
				// Whatever the current action is is cancelled and removed from the focus text
				// If the player happened to be moving somewhereto perform an action,
				// that is cancelled as well.
				if(objects.clickObjects(dialogue, player) == false){
					player.currentAction = player.ACTIONS.NONE;
					SetFocusText("");
					player.useGiveItem = undefined;
					player.setCurrentActionFunction(function(){});
				}

			}

			// Checks if the UI was clicked and takes the necessary actions over on the UI side
			// If no UI elements were clicked, cancels the current action
			else if(ui.CheckUIClick(player, dialogue, objects) == false){
				player.currentAction = player.ACTIONS.NONE;
				SetFocusText("");
				player.useGiveItem = undefined;
			}

		// CLICKING DURING DIALOGUE
		} else if(game.gameState == game.GAME_STATE.DIALOGUE){
			if(dialogue.lines.length > 0)
				dialogue.lines.splice(0,1);
			else {
				dialogue.converseClick();
			}
		} else if (game.gameState == game.GAME_STATE.MENU){
			startMenu.click(ctx, player, utility.GetObject(objects.list, "Mackenzie"), game);
		}
	};







	let keyChar
	const SetAction = function(string, action){
		player.currentAction = action;
		SetFocusText(string);
		player.useGiveItem = undefined;
	}
	const OnKeyUp = function(e){
		keyChar = String.fromCharCode(e.keyCode);

		// Keyboard controls set Actions.
		// Controls based on Indiana Jones and the Fate of Atlantis

		switch (keyChar){
			case 'G':
				SetAction("Give", player.ACTIONS.GIVE);
				break;
			case 'O':
				SetAction("Open", player.ACTIONS.OPEN);
				break;
			case 'C':
				SetAction("Close", player.ACTIONS.CLOSE);
				break;
			case 'P':
				SetAction("Pick Up", player.ACTIONS.PICK_UP);
				break;
			case 'T':
				SetAction("Talk To", player.ACTIONS.TALK_TO);
				break;
			case 'L':
				SetAction("Look At", player.ACTIONS.LOOK_AT);
				break;
			case 'U':
				SetAction("Use", player.ACTIONS.USE);
				break;
			case 'S':
				SetAction("Push", player.ACTIONS.PUSH);
				break;
			case 'Y':
				SetAction("Pull", player.ACTIONS.PULL);
				break;
		}
	};













	// Touch controls
	// Moving and releasing a touch moves the mouse position
	// Releasing a touch acts as a click
	// When touching the canvas, default behavior such as scrolling is disabled

	const TouchMove = function(e){
		let touch = e.touches[0];
		mouse.x = touch.clientX - e.target.offsetLeft;;
		mouse.y = touch.clientY - e.target.offsetTop;;
	};
	const TouchInit = function(canvas){
		canvas.addEventListener("touchstart", function (e) {
			e.preventDefault();
		});
		canvas.addEventListener("touchend", function (e) {
			e.preventDefault();
		});
		canvas.addEventListener("touchmove", function (e) {
			e.preventDefault();
		});
	};


	



	return Object.freeze({
		mouse : mouse,

		Init : Init
	});

}();





