"use strict";

const ui = (function(){

	const BOTTOM_BOUND = 284;		// The y position on the screen where the play area ends and the UI menu begins
	const FOCUS_TEXT_HEIGHT = 26;	// How much vertical space at the top of the UI box is used for this
	const GRAY = "#505050";		// A gray color for the UI

	let actionButtons = [];		// The 9 action button objects
	let _focusText = "";			// Text on the UI to inform the player of their current action and what object the mouse is over
	let _cursorImage = undefined;	// The sprite for the cursor

	const SetFocusText = function(input){ _focusText = input; };
	const SetCursorImage = function(input) { _cursorImage = input; };





	const Update = function(){

		// Highlights whatever button the mouse is over,
		// and unhighlights everything when the mouse is out of the UI box
		// The values set here are used to determine what buttons the mouse is over when it clicks

		if(input.mouse.y > BOTTOM_BOUND){
			HighlightButtons(input, player, WIDTH, HEIGHT);
		} else {
			UnhighlightUI(player);
		}
	}




	const Draw = function(ctx, WIDTH, HEIGHT, game, input, player, dialogue, draw, scene){

		// Fills in the initial UI box

		ctx.fillStyle = GRAY; 
		ctx.fillRect(0, BOTTOM_BOUND, WIDTH, HEIGHT - BOTTOM_BOUND); 

		// UI FOR GAMEPLAY
		if(game.gameState == game.GAME_STATE.GAMEPLAY){

			// Adds a black bar for the focus text at the top of the UI box,
			// and writes in the focus text

			ctx.fillStyle = "black";
			ctx.fillRect(0, BOTTOM_BOUND + 2, WIDTH, FOCUS_TEXT_HEIGHT - 4); 
			utility.FillText(ctx, _focusText, WIDTH/2, BOTTOM_BOUND + 15, "16pt monkeyisland1", "white");
	
			// Draws the action buttons and the inventory

			ui.DrawActionButtons(ctx, player, WIDTH, HEIGHT);
			DrawInventory(ctx, player, draw, scene, WIDTH, HEIGHT);
		}

		// UI FOR DIALOGUE
		if(game.gameState == game.GAME_STATE.DIALOGUE){

			// Divides the UI into 6 bars,
			// which will hold dialogue options

			const DIVS = 6;
			const h = (HEIGHT - BOTTOM_BOUND) / DIVS;
			let y;

			for(let n = 0; n < DIVS; ++n){
				y = h * n + BOTTOM_BOUND;

				ctx.fillStyle = GRAY;
				ctx.strokeStyle = "black";
				ctx.fillRect(0, y, WIDTH, h);
				ctx.strokeRect(0, y, WIDTH, h);

				// Writes the dialogue options in the UI
				// If no dialogue is in the list (and therefore being spoken)
				// and if there are discourse options to print

				if(dialogue.lines.length == 0 &&
					dialogue.discourseOptions != undefined &&
					n < dialogue.discourseOptions.length){

					let color = "white";
					if(dialogue.discourseOptions[n].mousedOver == true)
						color = "yellow";
					utility.FillText(ctx, dialogue.discourseOptions[n].line, 5, y + h/2, "16pt monkeyisland1", color, "left");
				}
			}
		}
		DrawCursor(ctx, input, draw);
	};




	const SetupUI = function(){

		// Sets up the UI by creating the buttons
		// This is called in init()

		actionButtons.push(new ui.ActionButton("Look At", player.ACTIONS.LOOK_AT));
		actionButtons.push(new ui.ActionButton("Use", player.ACTIONS.USE));
		actionButtons.push(new ui.ActionButton("Pick Up", player.ACTIONS.PICK_UP));
		actionButtons.push(new ui.ActionButton("Push", player.ACTIONS.PUSH));
		actionButtons.push(new ui.ActionButton("Pull", player.ACTIONS.PULL));
		actionButtons.push(new ui.ActionButton("Give", player.ACTIONS.GIVE));
		actionButtons.push(new ui.ActionButton("Talk To", player.ACTIONS.TALK_TO));
		actionButtons.push(new ui.ActionButton("Open", player.ACTIONS.OPEN));
		actionButtons.push(new ui.ActionButton("Close", player.ACTIONS.CLOSE));
	};




	const CheckUIClick = function(player, dialogue, objects){

		// When clicked,
		// Checks each of the action buttons to see if the mouse is over them
		// If so, sets the current action and the focus text

		for(let n = 0; n < actionButtons.length; ++n){
			if(actionButtons[n].highlighted == true){
				player.currentAction = actionButtons[n].action;
				_focusText = actionButtons[n].text;
				player.useGiveItem = undefined;

				return true;
			}
		}

		// Checks each of the inventory items to see if the mouse is over them
		// Calls function to deal with performing actions on object
		// Cancels/ends current action

		for(let n = 0; n < player.inventory.length; ++n){
			if(player.inventory[n].mousedOver == true){

				objects.clickObj(player.inventory[n].object, dialogue, player);

				if(player.useGiveItem == undefined){
					player.currentAction = 0;
					_focusText = "";
				}

				return true;
			}
		}

		return false;
	};




	const DrawActionButtons = function(ctx, player, WIDTH, HEIGHT){

		// Draws the 9 action buttons to the UI in a 3x3 grid
		// If the mouse is hovering over a button or 
		// if its action is the current action,
		// its text is highlighted

		for(let n = 0; n < actionButtons.length; ++n){
			let rect = GetActionButtonRect(n, WIDTH, HEIGHT);
	
			ctx.fillStyle = GRAY;
			//ctx.strokeStyle = "white";
			ctx.strokeStyle = "gray";
			ctx.lineWidth = 2;
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	
			let color = "white";
			if(actionButtons[n].highlighted == true ||
				player.currentAction == actionButtons[n].action) 
				color = "yellow";
			utility.FillText(ctx, actionButtons[n].text, rect.x + rect.width/2, rect.y + rect.height/2, "16pt monkeyisland1", color);
		}
	};




	const HighlightButtons = function(input, player, WIDTH, HEIGHT){

		// Checks each action button to see if the mouse is over it
		// Sets the button's "highlighted" property

		for(let n = 0; n < actionButtons.length; ++n){
			let rect = GetActionButtonRect(n, WIDTH, HEIGHT);
			actionButtons[n].highlighted = utility.RectangleContainsPoint(rect, input.mouse);
		}

		// Checks each inventory item to see if mouse is over it
		// Sets "mousedOver" property
		// Updates focus text to reflect moused over item (as well as the current action)

		let action = utility.GetActionText(ui, player);

		let selection = false;
		for(let n = 0; n < player.inventory.length; ++n){
			let rect = GetInventoryButtonRect(n, WIDTH, HEIGHT);
			player.inventory[n].mousedOver = utility.RectangleContainsPoint(rect, input.mouse);
			if(player.inventory[n].mousedOver == true){
				_focusText = action + player.inventory[n].object.name;
				selection = true;
			} else if(selection == false){
				_focusText = action;
			}
		}
	};




	const UnhighlightUI = function(player){

		// Goes through all action buttons and inventory
		// and sets their moused over properties to false

		for(let n = 0; n < actionButtons.length; ++n)
			actionButtons[n].highlighted = false;
		for(let n = 0; n < player.inventory.length; ++n)
			player.inventory[n].mousedOver = false;
	};



	const GetActionButtonRect = function(index, WIDTH, HEIGHT){

		// Gets a rect object containing the position and size of
		// an actionButton, given an index.
		// It figures out where in a 3x3 grid the button will go,
		// and what the position on screen will be

		let rect = {};
		rect.width = WIDTH / 6;
		rect.height = (HEIGHT - BOTTOM_BOUND - FOCUS_TEXT_HEIGHT)/3;
		rect.x = (index % 3) * rect.width;
		rect.y = Math.floor(index/3) * rect.height + BOTTOM_BOUND + FOCUS_TEXT_HEIGHT;
		return rect;
	};
	



	const ActionButton = function(t, a){

		// Action button constructor
		// Takes text and action of button
		// also has mousedOver/highlighted property

		this.text = t;
		this.action = a;
		this.highlighted = false;
	};
	



	const DrawCursor = function(ctx, input, draw){

		// Draws the cursor in the mouse position
		// (The mouse itself is hidden in the canvas)
		let width = _cursorImage.naturalWidth * 2;
		let height = _cursorImage.naturalHeight * 2;
		let x = input.mouse.x - width/2;
		let y = input.mouse.y - height/2;
		
		x = Math.floor(x / draw.sizeMultiplier); x = x * draw.sizeMultiplier;	// Constrains cursor to pixels
		y = Math.floor(y / draw.sizeMultiplier); y = y * draw.sizeMultiplier;

		ctx.drawImage(
				_cursorImage,
				x,
				y,
				width,
				height);

		// DEBUG display mouse position
		//utility.FillText(ctx, "(" + (x + width/2 - 1) + "," + (y + width/2 - 1) + ")", x + 20, y + 30, "12pt courier", "white", "left");
	};
	



	const DrawInventory = function(ctx, player, draw, scene, WIDTH, HEIGHT){

		// Draws the inventory on the UI
	
		let rect;
		for(let n = 0; n < player.inventory.length; ++n){
			rect = GetInventoryButtonRect(n, WIDTH, HEIGHT);
	
			ctx.fillStyle = GRAY;
			ctx.lineWidth = 2;
			if(iplayer.inventory[n].mousedOver == true)
				ctx.strokeStyle = "yellow";
			//else ctx.strokeStyle = "black";
			else ctx.strokeStyle = "gray";
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	
			// DRAW THE OBJECT IN HERE
			let obj = player.inventory[n].object;
			obj.position.x = rect.x + rect.width/2;
			obj.position.y = rect.y + rect.height;
			obj.draw(ctx, scene);

		}
	};
	


	const HORIZ_DIVS = 5;
	const VERT_DIVS = 2;
	const GetInventoryButtonRect = function(index, WIDTH, HEIGHT){
		// Gets the rectangle for the given inventory button
		let invRect = {};
		invRect.width = WIDTH / (HORIZ_DIVS * 2);
		invRect.height = (HEIGHT - BOTTOM_BOUND - FOCUS_TEXT_HEIGHT)/VERT_DIVS;
		invRect.x = (index % HORIZ_DIVS) * invRect.width + WIDTH/2;
		invRect.y = Math.floor(index/HORIZ_DIVS) * invRect.height + BOTTOM_BOUND + FOCUS_TEXT_HEIGHT;
		return invRect;
	}




	return Object.freeze({
		BOTTOM_BOUND : BOTTOM_BOUND,

		actionButtons : actionButtons,

		SetFocusText : SetFocusText,
		SetCursorImage : SetCursorImage,
		Update : Update,
		Draw : Draw,
		SetupUI : SetupUI,
		CheckUIClick : CheckUIClick,
		DrawActionButtons : DrawActionButtons,
		ActionButton : ActionButton,
		DrawCursor : DrawCursor,
	});

})();