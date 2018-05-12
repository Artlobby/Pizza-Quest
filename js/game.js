"use strict";
var app = app || {};

app.game = function(){

	var game = {};

	game.GAME_STATE = Object.freeze({
		MENU : 0,
		GAMEPLAY : 1,
		DIALOGUE : 2,
		CUTSCENE : 3,
		END : 4
	});

	game.gameOver = false;
	game.paused = false;

	game.gameState = game.GAME_STATE.MENU;

	game.updateGameState = function(){
		
		// Updates dialogue if there is dialogue
		if(this.game.paused == true){
			// Don't do nuthin'
			this.audio.stopIntroMusic();
		} else if(this.dialogue.lines.length > 0 ||
			this.dialogue.discourseOptions != undefined){ 
			this.game.gameState = this.game.GAME_STATE.DIALOGUE;
			this.dialogue.update(this.ctx, this.player, this.ui, this.input, this.WIDTH, this.HEIGHT);
		} else if (game.gameOver == true){
			this.game.gameState = this.game.GAME_STATE.END;
			this.audio.playIntroMusic();
		} else if(this.game.gameState != this.game.GAME_STATE.MENU &&
			this.game.gameState != this.game.GAME_STATE.CUTSCENE &&
			this.game.gameState != this.game.GAME_STATE.END){
				this.audio.stopIntroMusic();
				this.game.gameState = this.game.GAME_STATE.GAMEPLAY;
		} 
	};

	return game;

}();