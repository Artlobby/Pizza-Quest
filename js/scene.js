"use strict";
var app = app || {};

app.scene = function(){

	var scene = {};
	var WIDTH;
	var HEIGHT;

	scene.init = function(){
		WIDTH = this.WIDTH;
		HEIGHT = this.HEIGHT;
		scene.scenes.push(new scene.Scene(186));
		scene.scenes.push(new scene.Scene(170));
		scene.scenes.push(new scene.Scene(148));
		scene.scenes.push(new scene.Scene(164));
		scene.scenes.push(new scene.Scene(190));
		scene.scenes.push(new scene.Scene(190));
		scene.scenes.push(new scene.Scene(100));

		scene.scenes[scene.sceneNames.PIZZA_INT].xMax = 510;
		scene.scenes[scene.sceneNames.PIZZA_INT].xMin = 170;
		scene.scenes[scene.sceneNames.THEATER_EXT].xMax = 420;
	};

	scene.scenes = [];
	scene.currentScene = 0;

	scene.sceneNames = {
		BUS_STOP : 0,
		THEATER_EXT : 1,
		THEATER_INT : 2,
		PARKING_LOT : 3,
		FITNESS : 4,
		PIZZA_EXT : 5,
		PIZZA_INT : 6
	};

	scene.Scene = function(h){
		this.image = undefined;
		this.xMin = 0;
		this.xMax = WIDTH;
		this.yMin = h;
		this.yMax = HEIGHT;
		this.draw = function(ctx){
			if(this.image != undefined){
				ctx.drawImage(
					this.image,
					0,
					0,
					//WIDTH,
					//WIDTH / this.image.width * this.image.height);
					this.image.width * 2, 
					this.image.height * 2);
			} else {
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, WIDTH, 1000);
			}
			
		}
	};

	return scene;

}();