"use strict";
var app = app || {};

app.main = {

	canvas : undefined,
	ctx : undefined,

	WIDTH : 640,
	HEIGHT : 400,
	animationID: 0,

	// ACTIONS THAT THE PLAYER CAN PERFORM (using the UI)
	PLAYER_ACTION : Object.freeze({
		NONE : 0,
		LOOK_AT : 1,
		USE : 2,
		PICK_UP : 3,
		PUSH : 4,
		PULL : 5,
		GIVE : 6,
		TALK_TO : 7,
		OPEN : 8,
		CLOSE : 9
	}),



	// INITIALIZES THE GAME
	init : function(){

		// SETS UP THE CANVAS
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx.imageSmoothingEnabled = false;	// Keeps pixellated look

		// BINDS FUNCTIONS TO MOUSE (AND TOUCH!) ACTIONS
		this.canvas.onmousemove = this.input.mouseMove.bind(this);
		this.canvas.onmousedown = this.input.mouseClick.bind(this);
		window.addEventListener("keyup", this.input.onKeyUp.bind(this));
		this.input.touchInit.bind(this)();
		this.canvas.addEventListener("touchstart", this.input.touchMove.bind(this));
		this.canvas.addEventListener("touchmove", this.input.touchMove.bind(this));
		this.canvas.addEventListener("touchend", this.input.mouseClick.bind(this));

		window.onblur = function(){
			this.game.paused = true;
		}.bind(this);
		window.onfocus = function(){
			this.game.paused = false;
		}.bind(this);

		// INITIALIZES SCENE
		this.scene.init.bind(this)();

		// INITIALIZES OBJECTS
		this.initObjects();

		// INITIALIZES THE UI
		this.ui.setupUI.bind(this)();

		// INITIALIZES THE DRAWING THING
		this.draw.init.bind(this)();

		// INITIALIZES THE DIALOGUE
		this.dialogue.init.bind(this)();

		// INITIALIZES THE START MENU
		this.startMenu.init.bind(this)();

		// INITIALIZED THE AUDIO
		this.audio.init();

		// BEGINS THE GAME LOOP
		this.update();
	},



	// THE GAME LOOP
	update : function(){
		// CALLS A NEW ANIMATION FRAME
		this.animationID = requestAnimationFrame(this.update.bind(this));

		// UPDATES THE OBJECTS
		this.objects.updateObjects.bind(this)();

		// UPDATES THE PLAYER
		this.player.update(this.ctx, this.game, this.dialogue);

		// UPDATES THE UI
		this.ui.update.bind(this)();

		// UPDATES THE GAME STATE
		this.game.updateGameState.bind(this)();

		// DRAWS THE EVERYTHING
		this.draw.draw.bind(this)();
	},

};