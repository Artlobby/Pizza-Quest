"use strict";
var app = app || {};

app.startMenu = function(){

	var startMenu = {};

	var titleImage = undefined;

	var alexPortrait = {img : undefined, mousedOver : false};
	var mackenziePortrait = {img : undefined, mousedOver : false};

	startMenu.init = function(){
		var portraitsSheet = new this.draw.Spritesheet(this.draw.spriteSheets[3], 2, 1);
		alexPortrait.img = new this.draw.Animation(portraitsSheet, 0, 1);
		mackenziePortrait.img = new this.draw.Animation(portraitsSheet, 1, 1);

		var logoSheet = new this.draw.Spritesheet(this.draw.spriteSheets[6], 1, 1);
		titleImage = new this.draw.Animation(logoSheet, 0, 1);
	};

	startMenu.click = function(input, player, friend, game){

		if(alexPortrait.mousedOver == true){
			game.gameState = game.GAME_STATE.GAMEPLAY;
		} else if(mackenziePortrait.mousedOver == true){
			// SWITCH CHARACTERS
				// CHANGE MACKENZIE NAME
				friend.name = "Alex";
				// SWITCH ANIMATIONS
				var alexAnims = player.animations;
				player.animations = friend.anims;
				friend.anims = alexAnims;
			game.gameState = game.GAME_STATE.GAMEPLAY;
		}
	}

	startMenu.draw = function(ctx, input){

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, 640, 400);

		startMenu.scrollOver(ctx, input, alexPortrait, 320, 340);
		startMenu.scrollOver(ctx, input, mackenziePortrait, 520, 340);

		startMenu.drawGraphic(ctx, titleImage, 320, 140);
		startMenu.drawGraphic(ctx, alexPortrait.img, 320, 340);
		startMenu.drawGraphic(ctx, mackenziePortrait.img, 520, 340);

		utility.FillText(ctx, "Select Character:", 120, 258, "16pt monkeyisland1", "white", "center");
		utility.FillText(ctx, "Alexander", 320, 372, "16pt monkeyisland1", "white", "center");
		utility.FillText(ctx, "Mackenzie", 520, 372, "16pt monkeyisland1", "white", "center");
		utility.FillText(ctx, "Alexander Earley's", 200, 30, "16pt monkeyisland1", "white", "center");
	};

	startMenu.drawGraphic = function(ctx, img, x, y){

		if(img == undefined) return;

		img.draw(ctx, x, y);
	};

	startMenu.scrollOver = function(ctx, input, img, x, y){
		ctx.fillStyle = "yellow";

		var rect = {};
			rect.width = img.img.width * 2;
			rect.height = img.img.height * 2;
			rect.x = x - rect.width/2;
			rect.y = y - rect.height;

	//	console.log(rect);

		if(utility.RectangleContainsPoint(rect, input.mouse)){
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			img.mousedOver = true;
		} else {
			img.mousedOver = false;
		}
	};

	return startMenu;

}();