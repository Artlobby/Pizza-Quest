"use strict";
var app = app || {};

app.draw = function(){

	var draw = {};




	draw.sizeMultiplier = 2;	// The multiplier by which the pixel art will be resized to make things biggerified
	draw.spriteSheets = [];		// The spritesheets, loaded in the html
	draw.backgrounds = [];		// The background images, loaded in the html
	draw.drawList = [];			// The (ordered) list of objects to draw, reset each frame




	draw.init = function(){
		// LOADS IN THE IMAGE ASSETS
		draw.spriteSheets = document.getElementById("sprites").children;
		draw.backgrounds = document.getElementById("backgrounds").children;

		// Sets scene backgrounds
		this.scene.scenes[this.scene.sceneNames.BUS_STOP].image = draw.backgrounds[0];
		this.scene.scenes[this.scene.sceneNames.THEATER_EXT].image = draw.backgrounds[1];
		this.scene.scenes[this.scene.sceneNames.THEATER_INT].image = draw.backgrounds[2];
		this.scene.scenes[this.scene.sceneNames.PARKING_LOT].image = draw.backgrounds[3];
		this.scene.scenes[this.scene.sceneNames.PIZZA_EXT].image = draw.backgrounds[4];
		this.scene.scenes[this.scene.sceneNames.PIZZA_INT].image = draw.backgrounds[5];
		this.scene.scenes[this.scene.sceneNames.FITNESS].image = draw.backgrounds[6];

		// Sets cursor
		this.ui.cursorImage = draw.spriteSheets[2];

		// Player Spritesheet (Alex)
		var playerSpritesheet = new draw.Spritesheet(draw.spriteSheets[0], 8, 4);
		this.player.animations.push(new draw.Animation(playerSpritesheet, 0, 1));		// Idle
		this.player.animations.push(new draw.Animation(playerSpritesheet, 1, 6));		// Walk forward
		this.player.animations.push(new draw.Animation(playerSpritesheet, 7, 6));		// Walk backward
		this.player.animations.push(new draw.Animation(playerSpritesheet, 13, 8));		// Walk right
		this.player.animations.push(new draw.Animation(playerSpritesheet, 21, 8));		// Walk left
		this.player.animations.push(new draw.Animation(playerSpritesheet, 29, 3));		// Talk

		// Mackenzie Spritesheet
		var mackenzieSpritesheet = new draw.Spritesheet(draw.spriteSheets[1], 8, 4);
		draw.assignAnim( this.objects.list, "Mackenzie", new draw.Animation(mackenzieSpritesheet, 0, 1));	// Idle
		draw.assignAnim( this.objects.list, "Mackenzie", new draw.Animation(mackenzieSpritesheet, 1, 6));	// Walk forward
		draw.assignAnim( this.objects.list, "Mackenzie", new draw.Animation(mackenzieSpritesheet, 7, 6));	// Walk backward
		draw.assignAnim( this.objects.list, "Mackenzie", new draw.Animation(mackenzieSpritesheet, 13, 8));	// Walk right
		draw.assignAnim( this.objects.list, "Mackenzie", new draw.Animation(mackenzieSpritesheet, 21, 8));	// Walk left
		draw.assignAnim( this.objects.list, "Mackenzie", new draw.Animation(mackenzieSpritesheet, 29, 3));	// Talk

		// Assigns sprites from the inventory spritesheet
		var inventorySpritesheet = new draw.Spritesheet(draw.spriteSheets[4], 5, 4);
		draw.assignAnim( this.objects.list, "Old Trophy", new draw.Animation(inventorySpritesheet, 0, 1));
		draw.assignAnim( this.objects.list, "Phone", new draw.Animation(inventorySpritesheet, 1, 1));
		draw.assignAnim( this.objects.list, "Quarter", new draw.Animation(inventorySpritesheet, 3, 10));
		draw.assignAnim( this.objects.list, "Quarter", new draw.Animation(inventorySpritesheet, 2, 1));
		draw.assignAnim( this.objects.list, "Bottle", new draw.Animation(inventorySpritesheet, 13, 1));
		draw.assignAnim( this.objects.list, "Bottle", new draw.Animation(inventorySpritesheet, 14, 1));
		draw.assignAnim( this.objects.list, "Bottle Cap", new draw.Animation(inventorySpritesheet, 15, 1));
		draw.assignAnim( this.objects.list, "Toy Robot Claw", new draw.Animation(inventorySpritesheet, 16, 1));
		draw.assignAnim( this.objects.list, "Pizza", new draw.Animation(inventorySpritesheet, 17, 1));
		draw.assignAnim( this.objects.list, "Phone Number", new draw.Animation(inventorySpritesheet, 18, 1));

		// Assigns sprites from the... not inventory spritesheet
		var tallSpritesheet = new draw.Spritesheet(draw.spriteSheets[5], 6, 4);
		draw.assignAnim( this.objects.list, "Trash Can", new draw.Animation(tallSpritesheet, 0, 1));
		draw.assignAnim( this.objects.list, "Bus Sign", new draw.Animation(tallSpritesheet, 1, 1));
		draw.assignAnim( this.objects.list, "Vending Machine", new draw.Animation(tallSpritesheet, 2, 1));
		draw.assignAnim( this.objects.list, "Pay Phone", new draw.Animation(tallSpritesheet, 3, 1));
		draw.assignAnim( this.objects.list, "Guy", new draw.Animation(tallSpritesheet, 4, 1));
		draw.assignAnim( this.objects.list, "Guy", new draw.Animation(tallSpritesheet, 4, 3));
		draw.assignAnim( this.objects.list, "Pizza Person", new draw.Animation(tallSpritesheet, 7, 1));
		draw.assignAnim( this.objects.list, "Pizza Person", new draw.Animation(tallSpritesheet, 7, 3));
		draw.assignAnim( this.objects.list, "Woman", new draw.Animation(tallSpritesheet, 10, 3));
		draw.assignAnim( this.objects.list, "Woman", new draw.Animation(tallSpritesheet, 13, 3));
		draw.assignAnim( this.objects.list, "Man", new draw.Animation(tallSpritesheet, 16, 5));
		draw.assignAnim( this.objects.list, "Man", new draw.Animation(tallSpritesheet, 21, 3));

		// Assigns the sprite for the people at the pizza place
		var pizzaGoersSpritesheet = new draw.Spritesheet(draw.spriteSheets[7], 1, 1);
		draw.assignAnim( this.objects.list, "Dining Area", new draw.Animation(pizzaGoersSpritesheet, 0, 1));
	};




	draw.draw = function(){

		if(this.game.paused == true){
			// DRAWS THE PAUSE MENU
			this.ctx.fillStyle = "black";
			this.ctx.fillRect(0, 0, 640, 480);
			fillText(this.ctx, "PAUSED", 320, 200, "16pt monkeyisland1", "white", "center");
		} else if(this.game.gameState == this.game.GAME_STATE.GAMEPLAY ||
			this.game.gameState == this.game.GAME_STATE.DIALOGUE){
			// DRAW BACKGROUND
			this.scene.scenes[this.scene.currentScene].draw(this.ctx, this.WIDTH, this.HEIGHT);
	
			// ADDS OBJECTS TO DRAW LIST
			this.objects.drawObjects(this.ctx, this.dialogue, draw, this.scene);
	
			// ADDS PLAYER TO DRAW LIST
			this.player.draw(this.ctx, draw.drawList, draw.DrawListObj);
	
			// DRAWS PLAYER AND OBJECTS TO SCREEN IN ORDER
			draw.drawList.sort(function (a,b){ return a.zPos - b.zPos; });
			for(var n = 0; n < draw.drawList.length; ++n)
				draw.drawList[n].draw();
			draw.drawList = [];
	
			// DRAWS THE DIALOGUE
			this.dialogue.drawDialogue(this.ctx, this.player, this.WIDTH, this.HEIGHT);
	
			// DRAWS THE UI
			this.ui.draw(this.ctx, this.WIDTH, this.HEIGHT, this.game, this.input, this.player, this.dialogue, draw, this.scene);
		} else if(this.game.gameState == this.game.GAME_STATE.MENU){
			// DRAWS THE MENU
			this.startMenu.draw(this.ctx, this.input);
			this.ui.drawCursor(this.ctx, this.input, this.draw);
		} else if(this.game.gameState == this.game.GAME_STATE.END){
			// DRAWS THE ENDGAME
			this.ctx.fillStyle = "black";
			this.ctx.fillRect(0, 0, 640, 480);
			fillText(this.ctx, "THE END", 320, 200, "16pt monkeyisland1", "white", "center");
			this.ui.drawCursor(this.ctx, this.input, this.draw);
		}
		
	};




	draw.assignAnim = function(objects, objectName, anim){

		// Takes an animation object and adds it to the animation array
		// of the given object

		var obj = GetObject(objects, objectName);
		if(obj != undefined){
			obj.anims.push(anim);
			if(obj.anims.length == 1){
				obj.width = anim.width * draw.sizeMultiplier;
				obj.height = anim.height * draw.sizeMultiplier;
			}
			return true;
		}
		return false;
	}




	draw.Spritesheet = function(img, x, y){
		this.image = img;
		this.xCount = x;
		this.yCount = y;
	};




	draw.Animation = function(sprites, begin, length){
		this.spritesheet = sprites;
		this.firstFrame = begin;
		this.length = length;
		this.currentFrame = 0;
		this.width = this.spritesheet.image.naturalWidth / this.spritesheet.xCount;
		this.height = this.spritesheet.image.naturalHeight / this.spritesheet.yCount;
		this.framerate = 1 / 10;
		this.timer = this.framerate;
		this.incrTimer = function(){
			this.timer -= deltaTime();
			if(this.timer <= 0) {
				this.timer = this.framerate;
				this.currentFrame++;
				if(this.currentFrame == this.length)
					this.currentFrame = 0;
			}
		};
		this.draw = function(ctx, x, y){

			if(this.length > 1) this.incrTimer();

			var width = this.width * draw.sizeMultiplier;		// Temp size double
			var height = this.height * draw.sizeMultiplier;

			// Repositions x and y so given pos is at bottom
			x -= width/draw.sizeMultiplier;
			y -= height;

			x = Math.floor(x / draw.sizeMultiplier); x = x * draw.sizeMultiplier;	// Constrains cursor to pixels
			y = Math.floor(y / draw.sizeMultiplier); y = y * draw.sizeMultiplier;
	
			var currentFrame = this.currentFrame + this.firstFrame;
	
			var sX = currentFrame % this.spritesheet.xCount * this.width;
			var sY = Math.floor( currentFrame / this.spritesheet.xCount ) * this.height;
	
			ctx.drawImage(
				this.spritesheet.image,
				sX,
				sY,
				this.width,
				this.height,
				x,
				y,
				width,
				height );
		}
	};




	draw.DrawListObj = function(z, func){
		this.zPos = z;
		this.draw = func;		// a function that will hold the draw function
	};




	return draw;




}();