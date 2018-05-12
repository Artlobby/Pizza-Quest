"use strict";
var app = app || {};


// Initializes the game once the window has loaded
window.onload = function(){
	app.main.player = app.player;
	app.main.game = app.game;
	app.main.dialogue = app.dialogue;
	app.main.input = app.input;
	app.main.ui = app.ui;
	app.main.objects = app.objects;
	app.main.initObjects = app.initObjects;
	app.main.startMenu = app.startMenu;
	app.main.draw = app.draw;
	app.main.scene = app.scene;
	app.main.audio = app.audio;
	app.main.init();
};