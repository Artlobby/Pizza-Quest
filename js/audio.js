"use strict";
var app = app || {};

app.audio = (function(){

	var introMusic = undefined;

	function init(){
		introMusic = document.querySelector("#introMusic");
		introMusic.volume = 0.05;
		playIntroMusic();
	}

	function playIntroMusic(){
		introMusic.play();
	}

	function stopIntroMusic(){
		introMusic.pause();
		introMusic.currentTime = 0;
	}

	return{
		init: init,
		playIntroMusic: playIntroMusic,
		stopIntroMusic: stopIntroMusic
	};

}());