"use strict";

const main = (function(){

	const canvas 		= undefined;
	const ctx 			= undefined;
	let _animationID 	= 0;
	const WIDTH 		= 640;
	const HEIGHT 		= 480;


	window.onload = function(){

		// SETS UP THE CANVAS
		canvas 						= document.querySelector('canvas');
		ctx 						= canvas.getContext('2d');
		canvas.width 				= WIDTH;
		canvas.height 				= HEIGHT;
		ctx.imageSmoothingEnabled 	= false;	// Keeps pixellated look
		
		input.Init(canvas);

		window.onblur = function(){
			game.paused = true;
		}.bind(main);
		window.onfocus = function(){
			game.paused = false;
		}.bind(main);

		scene.init.bind(this)();
		initObjects();
		ui.SetupUI.bind(this)();
		draw.init.bind(this)();
		dialogue.init.bind(this)();
		startMenu.init.bind(this)();
		audio.init();
		update();
	};

	const Update = function(){
		_animationID = requestAnimationFrame(Update.bind(this));
		objects.updateObjects.bind(this)();
		player.update(ctx, game, dialogue);
		ui.Update.bind(this)();
		game.updateGameState.bind(this)();
		draw.draw.bind(this)();
	};

	return Object.freeze({
		WIDTH 			: WIDTH,
		HEIGHT 			: HEIGHT,

		canvas	 		: canvas,
		ctx 			: ctx,

		init 			: Init,
		update 			: Update
	});
})();