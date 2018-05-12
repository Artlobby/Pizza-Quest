"use strict";
var app = app || {};

app.ui = function(){

	var ui = {};




	ui.bottomBound = 284;		// The y position on the screen where the play area ends and the UI menu begins
	ui.focusText = "";			// Text on the UI to inform the player of their current action and what object the mouse is over
	ui.focusTextHeight = 26;	// How much vertical space at the top of the UI box is used for this
	ui.actionButtons = [];		// The 9 action button objects
	ui.cursorImage = undefined;	// The sprite for the cursor

	var gray = "#505050";		// A gray color for the UI




	ui.update = function(){

		// Highlights whatever button the mouse is over,
		// and unhighlights everything when the mouse is out of the UI box
		// The values set here are used to determine what buttons the mouse is over when it clicks

		if(this.input.mouse.y > ui.bottomBound){
			ui.highlightButtons(this.input, this.player, this.WIDTH, this.HEIGHT);
		} else {
			ui.unhighlightUI(this.player);
		}
	}




	ui.draw = function(ctx, WIDTH, HEIGHT, game, input, player, dialogue, draw, scene){

		// Fills in the initial UI box

		ctx.fillStyle = gray; 
		ctx.fillRect(0, ui.bottomBound, WIDTH, HEIGHT - ui.bottomBound); 

		// UI FOR GAMEPLAY
		if(game.gameState == game.GAME_STATE.GAMEPLAY){

			// Adds a black bar for the focus text at the top of the UI box,
			// and writes in the focus text

			ctx.fillStyle = "black";
			ctx.fillRect(0, ui.bottomBound + 2, WIDTH, ui.focusTextHeight - 4); 
			fillText(ctx, ui.focusText, WIDTH/2, ui.bottomBound + 15, "16pt monkeyisland1", "white");
	
			// Draws the action buttons and the inventory

			ui.drawActionButtons(ctx, player, WIDTH, HEIGHT);
			ui.drawInventory(ctx, player, draw, scene, WIDTH, HEIGHT);
		}

		// UI FOR DIALOGUE
		if(game.gameState == game.GAME_STATE.DIALOGUE){

			// Divides the UI into 6 bars,
			// which will hold dialogue options

			var divs = 6;
			var h = (HEIGHT - ui.bottomBound) / divs;
			var y;

			for(var n = 0; n < divs; ++n){
				y = h * n + ui.bottomBound;

				ctx.fillStyle = gray;
				ctx.strokeStyle = "black";
				ctx.fillRect(0, y, WIDTH, h);
				ctx.strokeRect(0, y, WIDTH, h);

				// Writes the dialogue options in the UI
				// If no dialogue is in the list (and therefore being spoken)
				// and if there are discourse options to print

				if(dialogue.lines.length == 0 &&
					dialogue.discourseOptions != undefined &&
					n < dialogue.discourseOptions.length){

					var color = "white";
					if(dialogue.discourseOptions[n].mousedOver == true)
						color = "yellow";
					fillText(ctx, dialogue.discourseOptions[n].line, 5, y + h/2, "16pt monkeyisland1", color, "left");
				}
			}
		}
		ui.drawCursor(ctx, input, draw);
	};




	ui.setupUI = function(){

		// Sets up the UI by creating the buttons
		// This is called in init()

		ui.actionButtons.push(new ui.ActionButton("Look At", this.PLAYER_ACTION.LOOK_AT));
		ui.actionButtons.push(new ui.ActionButton("Use", this.PLAYER_ACTION.USE));
		ui.actionButtons.push(new ui.ActionButton("Pick Up", this.PLAYER_ACTION.PICK_UP));
		ui.actionButtons.push(new ui.ActionButton("Push", this.PLAYER_ACTION.PUSH));
		ui.actionButtons.push(new ui.ActionButton("Pull", this.PLAYER_ACTION.PULL));
		ui.actionButtons.push(new ui.ActionButton("Give", this.PLAYER_ACTION.GIVE));
		ui.actionButtons.push(new ui.ActionButton("Talk To", this.PLAYER_ACTION.TALK_TO));
		ui.actionButtons.push(new ui.ActionButton("Open", this.PLAYER_ACTION.OPEN));
		ui.actionButtons.push(new ui.ActionButton("Close", this.PLAYER_ACTION.CLOSE));
	};




	ui.checkUIClick = function(player, dialogue, objects){

		// When clicked,
		// Checks each of the action buttons to see if the mouse is over them
		// If so, sets the current action and the focus text

		for(var n = 0; n < ui.actionButtons.length; ++n){
			if(ui.actionButtons[n].highlighted == true){
				player.currentAction = ui.actionButtons[n].action;
				ui.focusText = ui.actionButtons[n].text;
				player.useGiveItem = undefined;

				return true;
			}
		}

		// Checks each of the inventory items to see if the mouse is over them
		// Calls function to deal with performing actions on object
		// Cancels/ends current action

		for(var n = 0; n < player.inventory.length; ++n){
			if(player.inventory[n].mousedOver == true){

				objects.clickObj(player.inventory[n].object, dialogue, player);

				if(player.useGiveItem == undefined){
					player.currentAction = 0;
					ui.focusText = "";
				}

				return true;
			}
		}

		return false;
	};




	ui.drawActionButtons = function(ctx, player, WIDTH, HEIGHT){

		// Draws the 9 action buttons to the UI in a 3x3 grid
		// If the mouse is hovering over a button or 
		// if its action is the current action,
		// its text is highlighted

		for(var n = 0; n < ui.actionButtons.length; ++n){
			var rect = ui.getActionButtonRect(n, WIDTH, HEIGHT);
	
			ctx.fillStyle = gray;
			//ctx.strokeStyle = "white";
			ctx.strokeStyle = "gray";
			ctx.lineWidth = 2;
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	
			var color = "white";
			if(ui.actionButtons[n].highlighted == true ||
				player.currentAction == ui.actionButtons[n].action) 
				color = "yellow";
			fillText(ctx, ui.actionButtons[n].text, rect.x + rect.width/2, rect.y + rect.height/2, "16pt monkeyisland1", color);
		}
	};




	ui.highlightButtons = function(input, player, WIDTH, HEIGHT){

		// Checks each action button to see if the mouse is over it
		// Sets the button's "highlighted" property

		for(var n = 0; n < ui.actionButtons.length; ++n){
			var rect = ui.getActionButtonRect(n, WIDTH, HEIGHT);
			ui.actionButtons[n].highlighted = rectangleContainsPoint(rect, input.mouse);
		}

		// Checks each inventory item to see if mouse is over it
		// Sets "mousedOver" property
		// Updates focus text to reflect moused over item (as well as the current action)

		var action = getActionText(ui, player);

		var selection = false;
		for(var n = 0; n < player.inventory.length; ++n){
			var rect = ui.getInventoryButtonRect(n, WIDTH, HEIGHT);
			player.inventory[n].mousedOver = rectangleContainsPoint(rect, input.mouse);
			if(player.inventory[n].mousedOver == true){
				ui.focusText = action + player.inventory[n].object.name;
				selection = true;
			} else if(selection == false){
				ui.focusText = action;
			}
		}
	};




	ui.unhighlightUI = function(player){

		// Goes through all action buttons and inventory
		// and sets their moused over properties to false

		for(var n = 0; n < ui.actionButtons.length; ++n)
			ui.actionButtons[n].highlighted = false;
		for(var n = 0; n < player.inventory.length; ++n)
			player.inventory[n].mousedOver = false;
	};



	ui.getActionButtonRect = function(index, WIDTH, HEIGHT){

		// Gets a rect object containing the position and size of
		// an actionButton, given an index.
		// It figures out where in a 3x3 grid the button will go,
		// and what the position on screen will be

		var rect = {};
		rect.width = WIDTH / 6;
		rect.height = (HEIGHT - ui.bottomBound - ui.focusTextHeight)/3;
		rect.x = (index % 3) * rect.width;
		rect.y = Math.floor(index/3) * rect.height + ui.bottomBound + ui.focusTextHeight;
		return rect;
	};
	



	ui.ActionButton = function(t, a){

		// Action button constructor
		// Takes text and action of button
		// also has mousedOver/highlighted property

		this.text = t;
		this.action = a;
		this.highlighted = false;
	};
	



	ui.drawCursor = function(ctx, input, draw){

		// Draws the cursor in the mouse position
		// (The mouse itself is hidden in the canvas)
		var width = ui.cursorImage.naturalWidth * 2;
		var height = ui.cursorImage.naturalHeight * 2;
		var x = input.mouse.x - width/2;
		var y = input.mouse.y - height/2;
		
		x = Math.floor(x / draw.sizeMultiplier); x = x * draw.sizeMultiplier;	// Constrains cursor to pixels
		y = Math.floor(y / draw.sizeMultiplier); y = y * draw.sizeMultiplier;

		ctx.drawImage(
				ui.cursorImage,
				x,
				y,
				width,
				height);

		// DEBUG display mouse position
		//fillText(ctx, "(" + (x + width/2 - 1) + "," + (y + width/2 - 1) + ")", x + 20, y + 30, "12pt courier", "white", "left");
	};
	



	ui.drawInventory = function(ctx, player, draw, scene, WIDTH, HEIGHT){

		// Draws the inventory on the UI

		var i = player.inventory;
	
		var rect;
		for(var n = 0; n < i.length; ++n){
			rect = ui.getInventoryButtonRect(n, WIDTH, HEIGHT);
	
			ctx.fillStyle = gray;
			ctx.lineWidth = 2;
			if(i[n].mousedOver == true)
				ctx.strokeStyle = "yellow";
			//else ctx.strokeStyle = "black";
			else ctx.strokeStyle = "gray";
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	
			// DRAW THE OBJECT IN HERE
			var obj = player.inventory[n].object;
			obj.position.x = rect.x + rect.width/2;
			obj.position.y = rect.y + rect.height;
			obj.draw(ctx, scene);

		}
	};
	



	ui.getInventoryButtonRect = function(index, WIDTH, HEIGHT){

		// Gets the rectangle for the given inventory button

		var horizDivs = 5;
		var vertDivs = 2;
	
		var rect = {}
	
		rect.width = WIDTH / (horizDivs * 2);
		rect.height = (HEIGHT - ui.bottomBound - ui.focusTextHeight)/vertDivs;
		rect.x = (index % horizDivs) * rect.width + WIDTH/2;
		rect.y = Math.floor(index/horizDivs) * rect.height + ui.bottomBound + ui.focusTextHeight;
	
		return rect;
	}




	return ui;

}();
















