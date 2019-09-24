
"use strict";


const util = {};

util.FillText = function(ctx, string, x, y, css, color, align) {
	// A quicker way to write text on the canvas
	ctx.save();
	if(align == undefined) 
		ctx.textAlign = "center";
	else ctx.textAlign = align;
	ctx.textBaseline = "middle";
	ctx.font = css;
	ctx.fillStyle = color;
	ctx.fillText(string, x, y);
	ctx.restore();
}




util.CheckTextLength = function(ctx, string, css) {
	// Checks the length of
	// a string of text on screen
	ctx.save();
	ctx.font = css;
	let w = ctx.measureText(string).width;
	ctx.restore();
	return w;
}




util.RectangleContainsPoint = function(rect, point){
	// Checks whether a point is within a rectangle
	if(rect.width <= 0 || rect.height <= 0) return false;
	return (point.x >= rect.x && point.x <= rect.x + rect.width &&
		point.y >= rect.y && point.y <= rect.y + rect.height);
}




let action;
util.GetActionText = function(ui, player){
	// Gets the written-out string version of an action

	action = "";

	for(let b = 0; b < ui.actionButtons.length; ++b)
		if(ui.actionButtons[b].action == player.currentAction){
			action = ui.actionButtons[b].text + " ";
			break;
		}

	if(player.useGiveItem != undefined){
		if(player.currentAction == 2 /* USE */)
			action += player.useGiveItem.name + " with ";
		if(player.currentAction == 6 /* GIVE */)
			action += player.useGiveItem.name + " to ";
	}

	return action;
}




util.QuickSay = function(words){

	// Quickly makes a function for the player to say something
	// Used to clean up object initialization

	return function(dialogue){
		dialogue.say(words);
	};
}




util.GetObject = function(objects, name){

	// Gets an object from the list, by its name

	for(let n = 0; n < objects.length; ++n){
		if(objects[n].name == name){
			return objects[n];
		}
	}
	return undefined;
}



// Gets the change in timre between frames
// (Lovingly) stolen from Boomshine
let lastTime = 0;
let now;
let fps;
util.DeltaTime = function(){
    now = performance.now();
    fps = 1000 / (now - lastTime);
    fps = Math.max(12, Math.min(60, fps));
    lastTime = now;
    return 1/fps;
};