"use strict";
var app = app || {};

app.objects = function(){




	var objects = {};

	
	

	// Array that holds all objects within the game
	objects.list = [];
	
	


	objects.updateObjects = function(){

		// Determines which objects in the play area
		// are moused over

		objects.mouseOverObjects(this.ui, this.player, this.input, this.draw, this.scene);
	};
	



	objects.drawObjects = function(ctx, dialogue, draw, scene){

		// Goes through objects array and draws each object

		for(var n = 0; n < objects.list.length; ++n){
			if(objects.list[n].inInventory == false){

				let obj = objects.list[n];

				let func = function(){
					obj.draw(ctx, scene, dialogue);
				};

				draw.drawList.push(new draw.DrawListObj(objects.list[n].position.y ,func));
			}
		}
	};
	



	objects.mouseOverObjects = function(ui, player, input, draw, scene){

		// Checks if the mouse is over any of the objects
		// If so, changes that object's mousedOver property

		// Returns if the mouse isn't in the play area
		if(input.mouse.y > ui.bottomBound) return;
	
		// Gets the written form of the current action
		var action = getActionText(ui, player);
	
		// Goes through each object
		for(var n = 0; n < objects.list.length; ++n){

			// Makes sure the object hasn't been picked up
			// and object is in scene
			if(objects.list[n].inInventory == false &&
				objects.list[n].scene == scene.currentScene){

				// Gets the rectangle of the current object
				// This will change later
				var rect = {};
				rect.width = objects.list[n].width;
				rect.height = objects.list[n].height;
				rect.x = objects.list[n].position.x - rect.width/2;
				rect.y = objects.list[n].position.y - rect.height;

				// Sets whether it is moused over
				objects.list[n].mousedOver = rectangleContainsPoint(rect, input.mouse);
		
				// Updates the focus text depending on whether the player has
				// moused over an object
				if(objects.list[n].mousedOver == true){
					ui.focusText = action + objects.list[n].name;
					return;
				} else {
					ui.focusText = action;
				}
			} else {
				objects.list[n].mousedOver = false;
			}
		}
	};
	 
	


	objects.clickObjects = function(dialogue, player){
	
		// Goes through each object when the mouse has clicked
		// and checks its mousedOver property to see if
		// it was clicked on
		// Calls appropriate functions and ends action

		for(var n = 0; n < objects.list.length; ++n){
			if(objects.list[n].mousedOver == true){
				objects.clickObj(objects.list[n], dialogue, player);
				player.currentAction = 0;	// This will change for the GIVE action
				return true;
			}
		}
		return false;
	};

	


	objects.clickObj = function(obj, dialogue, player){

		// The player.currentActionFunction is a function that runs
		// whenever the player isn't moving
		// Usually, it is an empty function
		// When a player acts on an object, it changes to a new function
		// The player will move to that object and when they stop, it will run once

		// Using the curent action, gets the corresponding function from the object
		var actionFunc = obj.actionFuncs[player.currentAction].bind(obj);

		// If the action is LOOK_AT or TALK_TO,
		// the player does not need to make physical contact
		// and the function just runs
		if(player.currentAction == 1 /*LOOK_AT*/ ||
			player.currentAction == 7 /*TALK_TO*/){
			actionFunc(dialogue, player);
			return;
		}

		// If the action is use (on an object that can be used with other objects)
		// or is the action is to give
		// and a first object has not been chosen
		// the function just runs
		if(((player.currentAction == 2 /* USE */ && obj.useWith == true)|| 
			player.currentAction == 6 /* GIVE */) &&
			player.useGiveItem == undefined){
			actionFunc(dialogue, player);
			return;
		}
	
		// Otherwise, the function waits until the player gets to the
		// specified target and stops	
		var func = function(){
			actionFunc(dialogue, player);
			player.currentActionFunction = function(){};
		};
		player.currentActionFunction = func.bind(this);
	};
	
	
	

	objects.Object = function(n, x, y, s){

		// Constructor for objects in the game
		
		this.name = n;				// The name of the object
		///this.xPos = x;				// The x position (currently of the top left hand corner)
		//this.yPos = y;				// The y position (currently of the top left hand corner)
		this.position = {
			x : x,
			y : y
		};
		this.anims = [];			// The sprites/animations that will represent the object onscreen
		this.width = 35;			// Width of the image  (initialized as 35, changed when anims are added)
		this.height = 35;			// Height of the image (initialized as 35, changed when anims are added)
		this.scene = s;				// The scene that the object is in
		this.inInventory = false;	// Whether the object is in the player's inventory (should really just remove this from the array when picked up)
		this.mousedOver = false;	// Whether the mouse is over this thing
		this.useWith = true;		// Whether this must be used with another object
		//this.isDoor = false;		// Whether this is a door

		// The functions to be run when actions are performed on the objects
		// Commonly just a unique line of dialogue unless a specific action is possible
		this.actionFuncs = [
			/* NONE		0 */	function(dialogue){},	// This would be run for doors
			/* LOOK_AT 	1 */ 	function(dialogue){ dialogue.say( "It appears to be a thing of some kind."); },
			/* USE		2 */ 	function(dialogue, player){
									if(player.useGiveItem == undefined){
										if(this.inInventory == false)
											dialogue.say("I can't use it if I don't have it.");
										else
											player.useGiveItem = this;
									} else {
										dialogue.say("I can't use those two things together");
									}
								},
			/* PICK_UP 	3 */ 	function(dialogue, player){
				 		 			if(this.inInventory == false){
				 						this.inInventory = true;
				 						player.addToInventory(this);
				 						dialogue.say( "This should come in handy.");
				 					} else {
				 						dialogue.say( "I already have it.");
				 					}
				 				},
			/* PUSH 	4 */ 	function(dialogue){ dialogue.say( "It won't budge!"); },
			/* PULL 	5 */ 	function(dialogue){ dialogue.say( "It won't budge!"); },
			/* GIVE 	6 */ 	function(dialogue, player){ 
									if(player.useGiveItem == undefined){
										if(this.inInventory == false)
											dialogue.say("I can't give it if I don't have it.");
										else
											player.useGiveItem = this;
									} else {
										dialogue.say("They wouldn't want it");
									}
								},
			/* TALK_TO 	7 */ 	function(dialogue){ dialogue.say( "Hello, thing."); },
			/* OPEN 	8 */ 	function(dialogue){ dialogue.say( "It doesn't seem to open"); },
			/* CLOSE 	9 */ 	function(dialogue){ dialogue.say( "It doesn't seem to close"); }
		];

		// This function draws the object to the screen
		// Currently only draws a square, in absence of actual game art
		this.draw = function(ctx, scene){
			if(scene.currentScene != this.scene &&
				this.inInventory == false) 
				return;
			if(this.anims.length == 0){
				ctx.globalAlpha = 0.7;
				ctx.fillStyle = "orange";
				ctx.fillRect(this.position.x - this.width/2, this.position.y - this.height, this.width, this.height);
				ctx.globalAlpha = 1;
			} else {
				//if(this.inInventory == false)
				this.anims[0].draw(ctx, this.position.x, this.position.y);
				//else
				//this.anims[1].draw(ctx, this.position.x, this.position.y);
			}
		};
	};




	return objects;

}();