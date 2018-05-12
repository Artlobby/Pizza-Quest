"use strict";
var app = app || {};

app.dialogue = function(){

	var dialogue = {};




	dialogue.speakers = [];					// Characters in the game who have dialogue
	dialogue.lines = [];					// The current set of dialogue, to be run through with mouse clicks
	dialogue.discourseOptions = undefined;	// The current set of options for things the player can say




	dialogue.init = function(){

		// Initializes the speakers
		// Each is given a position and height
		// to help in positioning the dialogue text

		var player = {
			position : this.player.position,
			height : this.player.animations[0].height * 2,
			color: "white"
		};
		var m = GetObject(this.objects.list, "Mackenzie");
		var mackenzie = {
			position : m.position,
			height : m.height,
			color: "lightblue"
		};
		var lady = GetObject(this.objects.list, "Woman");
		var pizzaVillain = {
			position : lady.position,
			height : lady.height,
			color : "magenta"
		};
		var fGuy = GetObject(this.objects.list, "Guy");
		var fitnessGuy = {
			position : fGuy.position,
			height : fGuy.height,
			color : "limegreen"
		};
		var cGuy = GetObject(this.objects.list, "Man");
		var coinGuy = {
			position : cGuy.position,
			height : cGuy.height,
			color : "lightgray"
		};
		var pp = GetObject(this.objects.list, "Pizza Person");
		var pizzaPerson = {
			position : pp.position,
			height : pp.height,
			color : "orange"
		};
		dialogue.speakers.push(player);
		dialogue.speakers.push(mackenzie);
		dialogue.speakers.push(pizzaVillain);
		dialogue.speakers.push(fitnessGuy);
		dialogue.speakers.push(coinGuy);
		dialogue.speakers.push(pizzaPerson);
	};




	dialogue.update = function(ctx, player, ui, input, WIDTH, HEIGHT){

		// If there is no dialogue to be spoken,
		// Runs functions for having the player choose dialogue

		if(dialogue.lines.length == 0)
			dialogue.converseInteract(ctx, ui, input, WIDTH, HEIGHT);
	};




	dialogue.say = function(words, speaker){

		// Adds a line of dialogue (along with it's speaker) to the lines array to be spoken
		// If the speaker is not specified, it is assumed to be the player

		if(speaker == undefined) speaker = 0;
		dialogue.lines.push({
			character : speaker,
			line : words
		});
	};




	dialogue.converseInteract = function(ctx, ui, input, WIDTH, HEIGHT){

		// Determines whether the mouse is currently over any of the dialogue options
		// Stores that info to be checked when the mouse is clicked

		var divs = 6;
		var h = (HEIGHT - ui.bottomBound) / divs;
		var y;
		var rect;

		for(var n = 0; n < dialogue.discourseOptions.length; ++n){
			y = h * n + ui.bottomBound;
			rect = {
				x : 0,
				y : y,
				width : WIDTH,
				height : h
			};
			dialogue.discourseOptions[n].mousedOver = rectangleContainsPoint(rect, input.mouse);
		}
	};




	dialogue.converseClick = function(){

		// Checks if the mouse clicked on a dialogue option
		// Is called when the mouse clicks, and checks if the mousedOver
		// property of any of the options is true

		for(var n = 0; n < dialogue.discourseOptions.length; ++n){
			if(dialogue.discourseOptions[n].mousedOver == true){

				// If an option is clicked, that option's dialogue and response dialogue
				// is added to the dialogue list to be said by the characters
				// Will skip over dialogue if it's undefined

				if (dialogue.discourseOptions[n].line != undefined)
					dialogue.say(dialogue.discourseOptions[n].line);
				if (dialogue.discourseOptions[n].response != undefined)
					dialogue.say(dialogue.discourseOptions[n].response, dialogue.discourseOptions[n].speaker);

				// An additional function can also be added
				// It can be used to add more dialogue

				if(dialogue.discourseOptions[n].moreTalk != undefined) 
					dialogue.discourseOptions[n].moreTalk(dialogue);

				// New dialogue options are set, via the chosen option
				// If the dialogue options are undefined, then the dialogue will end

				//console.log(dialogue.discourseOptions[n].choices);
				dialogue.discourseOptions = dialogue.discourseOptions[n].choices;

				break;
			}
		}
	};




	dialogue.drawDialogue = function(ctx, player, WIDTH, HEIGHT){

		// Draws the current line of dialogue to the screen

		if(dialogue.lines.length == 0) return;

		var speaker = dialogue.speakers[dialogue.lines[0].character];

		// Uses the position and height of the speaker to
		// position the line of dialogue above their head

		var height = speaker.height;	// TEMP VALUE
		var x = speaker.position.x;
		var y = speaker.position.y - height - 15;

		// Keeps the dialogue below a certain height
		// and within the width of the frame

		var heightLimit = 50;
		if(y < heightLimit) y = heightLimit;
		var tWidth = checkTextLength(ctx, dialogue.lines[0].line, "16pt monkeyisland2");
		if(x + tWidth/2 > WIDTH) x = WIDTH - tWidth/2;
		if(x - tWidth/2 < 0) x = tWidth/2;

		fillText(ctx, dialogue.lines[0].line, x, y, "16pt monkeyisland1", speaker.color);
		fillText(ctx, dialogue.lines[0].line, x, y, "16pt monkeyisland2", "black");
	};




	return dialogue;

}();