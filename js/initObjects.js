"use strict";
var app = app || {};


/*
	This mess of code is where the game itself is assembled.
	The rest of the code mostly sets up the framework,
	but this is where objects and people are placed 
	in the world and given functionality.
*/




app.initObjects = function(){


	/*
		Initializing variable to be used
	*/
	var scene = this.scene;
	var player = this.player;
	var objList = this.objects.list;
	var game = this.game;
	var ACTIONS = this.PLAYER_ACTION;

	// Standard sizes, to make spritesheeting more efficient
	var tallSize = {
		x : 60,
		y : 120
	};
	var invSize = {
		x : 64,
		y : 45
	};
	var posterSize = {
		x : 50,
		y : 70
	};



	/***************\

		MACKENZIE

	\***************/

	var mackenzie = new this.objects.Object("Mackenzie", 350, 220, 0);
	
	mackenzie.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's " + mackenzie.name + ".");
	mackenzie.actionFuncs[ACTIONS.USE] = utility.QuickSay("That seems rather rude.");
	mackenzie.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I don't need to.");
	mackenzie.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("They could probably beat me up.");
	mackenzie.actionFuncs[ACTIONS.PULL] = utility.QuickSay("They could probably beat me up.");
	mackenzie.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("They are not mine to give.");
	mackenzie.actionFuncs[ACTIONS.TALK_TO] = function(dialogue){
		dialogue.say("Hey.");
		dialogue.say("Hey.", 1);
		dialogue.discourseOptions = mackenzieDialogue.choices;
	};
	mackenzie.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("That seems rather rude.");
	mackenzie.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("That seems rather rude.");
	mackenzie.useWith = false;

	// Custom animation and motion
	mackenzie.currentAnim = 0;
	mackenzie.follow = function(){

		var maxDistX = 100;
		var maxDistY = 50;
		var speedX = 2.5;
		var speedY = 1;

		mackenzie.currentAnim = 0;

		if(player.position.x - mackenzie.position.x > maxDistX){
			mackenzie.position.x += speedX;
			mackenzie.currentAnim = 3;
		} else if (mackenzie.position.x - player.position.x > maxDistX){
			mackenzie.position.x -= speedX;
			mackenzie.currentAnim = 4;
		}
		if(player.position.y - mackenzie.position.y > maxDistY){
			mackenzie.position.y += speedY;
			mackenzie.currentAnim = 1;
		} else if (mackenzie.position.y - player.position.y > maxDistY){
			mackenzie.position.y -= speedY;
			mackenzie.currentAnim = 2;
		}
	};
	mackenzie.draw = function(ctx, scene, dialogue){

		if(dialogue.lines.length > 0 &&
			dialogue.lines[0].character == 1){
			mackenzie.anims[5].draw(ctx, mackenzie.position.x, mackenzie.position.y);
		} else {
			mackenzie.follow();
			mackenzie.anims[mackenzie.currentAnim].draw(ctx, mackenzie.position.x, mackenzie.position.y);
		}
	};

	var mackenzieDialogue = {};
	mackenzieDialogue.choices = [];
	mackenzieDialogue.choices.push({
		line : "How are you doing?",
		response : "I'm hungry for pizza.",
		speaker : 1,
		choices : mackenzieDialogue.choices,
		mousedOver : false
	});
	mackenzieDialogue.choices.push({
		line : "What do we do now?",
		response : "We go get pizza.",
		speaker : 1,
		choices : mackenzieDialogue.choices,
		mousedOver : false
	});
	mackenzieDialogue.choices.push({
		line : "*snap* SLEEP!",
		response : "Nope, sorry, hypnosis is still not working.",
		speaker : 1,
		moreTalk : utility.QuickSay("Damn."),
		choices : mackenzieDialogue.choices,
		mousedOver : false
	});
	mackenzieDialogue.choices.push({
		line : "Let's get going.",
		response : undefined,
		speaker : 1,
		choices : undefined,
		mousedOver : false
	});

	objList.push(mackenzie);































	/*********************\

		BUS STOP SCENE

	\*********************/




	/*
		PATH TO THEATER
	*/
	var theaterPath = new this.objects.Object("Theater", 610, 480, scene.sceneNames.BUS_STOP);
	theaterPath.width = 60;
	theaterPath.height = 480;
	theaterPath.draw = function(){};
	theaterPath.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the local movie theater.");
	theaterPath.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.THEATER_EXT;
		mackenzie.scene = scene.sceneNames.THEATER_EXT;

		player.position.x = -50;		// Position coordinates must be set individually
		player.position.y = 200;		// to avoid creating new object
		player.destination.x = 150;
		player.destination.y = 200;
		mackenzie.position.x = -100;
		mackenzie.position.y = 200;
	};
	theaterPath.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");



	/*
		PATH TO PARKING LOT
	*/
	var parkingLotPath = new this.objects.Object("Parking Lot", 30, 480, scene.sceneNames.BUS_STOP);
	parkingLotPath.width = 60;
	parkingLotPath.height = 480;
	parkingLotPath.draw = function(){};
	parkingLotPath.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's a parking lot.");
	parkingLotPath.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.PARKING_LOT;
		mackenzie.scene = scene.sceneNames.PARKING_LOT;

		player.position.x = 700;		// Position coordinates must be set individually
		player.position.y = 200;		// to avoid creating new object
		player.destination.x = 490;
		player.destination.y = 200;
		mackenzie.position.x = 750;
		mackenzie.position.y = 200;
	};
	parkingLotPath.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");



	// BUS STOP SIGN
	var busStopSign = new this.objects.Object("Bus Sign", 176, 240, scene.sceneNames.BUS_STOP);
	busStopSign.width = tallSize.x;
	busStopSign.height = tallSize.y;
	busStopSign.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
		dialogue.say("It's the bus stop sign.");
		dialogue.say("It's pretty faded.");
	};
	busStopSign.actionFuncs[ACTIONS.USE] = utility.QuickSay("It's just a sign.");
	busStopSign.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("No thanks.");
	busStopSign.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's not moving.");
	busStopSign.actionFuncs[ACTIONS.PULL] = utility.QuickSay("It's not moving.");
	busStopSign.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("It's just a sign.");
	busStopSign.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, sign.");
	busStopSign.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("It's just a sign.");
	busStopSign.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's just a sign.");



	// STORM DRAIN
	var stormDrain = new this.objects.Object("Storm Drain", 548, 270, scene.sceneNames.BUS_STOP);
	stormDrain.width = 80;
	stormDrain.height = 14;
	stormDrain.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
		dialogue.say("It's a storm drain.");
		dialogue.say("It's still got water in it for some reason.");
	};
	stormDrain.actionFuncs[ACTIONS.USE] = function(dialogue){
		if(player.useGiveItem == undefined){
			dialogue.say("Can't really do that.");
		} else {
			switch(player.useGiveItem) {
				case trophy:
					dialogue.say("I've cleaned off the dirt and grime!");
					trophy.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
						dialogue.say("It says:");
						dialogue.say("1990 Regional Soccer Tournament Champion:");
						dialogue.say("Agnes Fishwater");
						
						question4Gen = function(){
							var choices = [];
							for(var n = 0; n < 3; ++n){
								var year = Math.round(Math.random() * 60 + 1950);
								if(year == 1990) year = 1991;
								choices.push({
									line : year + ".",
									response : undefined,
									speaker : 3,
									moreTalk : fitnessGuyQuestionsEnd,
									choices : fitGuyDialogue.choices,
									mousedOver : false
								});
							}
							choices.push({
								line : "1990.",
								response : undefined,
								speaker : 3,
								moreTalk : function(dialogue){
									++questioningScore;
									fitnessGuyQuestionsEnd(dialogue);
								},
								choices : fitGuyDialogue.choices,
								mousedOver : false
							});
							return choices;
						};

					};
					break;
				default:
					dialogue.say("I don't need to throw that away.");
			}
		}
	};
	stormDrain.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("It's a hole in the ground.");
	stormDrain.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's a hole in the ground.");
	stormDrain.actionFuncs[ACTIONS.PULL] = utility.QuickSay("It's a hole in the ground.");
	stormDrain.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("It's a hole in the ground.");
	stormDrain.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, storm drain.");
	stormDrain.draw = function(){};





	objList.push(theaterPath);
	objList.push(parkingLotPath);
	objList.push(busStopSign);
	objList.push(stormDrain);
































	/*****************************\

		THEATER EXTERIOR SCENE

	\*****************************/




	
	/*
		PATH TO BUS STOP
	*/
	var theaterToBusStop = new this.objects.Object("Bus Stop", 30, 480, scene.sceneNames.THEATER_EXT);
	theaterToBusStop.width = 60;
	theaterToBusStop.height = 340;
	theaterToBusStop.draw = function(){};
	theaterToBusStop.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the bus stop");
	theaterToBusStop.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.BUS_STOP;
		mackenzie.scene = scene.sceneNames.BUS_STOP;

		player.position.x = 700;		// Position coordinates must be set individually
		player.position.y = 200;		// to avoid creating new object
		player.destination.x = 490;
		player.destination.y = 200;
		mackenzie.position.x = 750;
		mackenzie.position.y = 200;
	};
	theaterToBusStop.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");


	/*
		THEATER DOOR
	*/
	var theaterDoor = new this.objects.Object("Theater Door", 530, 228, scene.sceneNames.THEATER_EXT);
	theaterDoor.width = 50;
	theaterDoor.height = 130;
	theaterDoor.draw = function(){};
	theaterDoor.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the entrance to the theater.");
	theaterDoor.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.THEATER_INT;
		mackenzie.scene = scene.sceneNames.THEATER_INT;

		player.position.x = 320;		// Position coordinates must be set individually
		player.position.y = 400;		// to avoid creating new object
		player.destination.x = 320;
		player.destination.y = 200;
		mackenzie.position.x = 320;
		mackenzie.position.y = 500;
	};
	theaterDoor.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");





	// Posters
	var poster1 = new this.objects.Object("Poster", 34, 122, scene.sceneNames.THEATER_EXT);
	poster1.width = posterSize.x;
	poster1.height = posterSize.y;
	poster1.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay('"Kill Phil"');
	poster1.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't.");
	poster1.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'll just have to pay for it if I do.");
	poster1.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's not moving.");
	poster1.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'll just have to pay for it if I do.");
	poster1.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't.");
	poster1.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello poster.");
	poster1.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I can't.");
	poster1.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("I can't.");
	poster1.draw = function(){};

	var poster2 = new this.objects.Object("Poster", 114, 122, scene.sceneNames.THEATER_EXT);
	poster2.width = posterSize.x;
	poster2.height = posterSize.y;
	poster2.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay('"Transrobots"');
	poster2.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't.");
	poster2.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'll just have to pay for it if I do.");
	poster2.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's not moving.");
	poster2.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'll just have to pay for it if I do.");
	poster2.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't.");
	poster2.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello poster.");
	poster2.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I can't.");
	poster2.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("I can't.");
	poster2.draw = function(){};

	var poster3 = new this.objects.Object("Poster", 190, 122, scene.sceneNames.THEATER_EXT);
	poster3.width = posterSize.x;
	poster3.height = posterSize.y;
	poster3.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
		dialogue.say('"Avatar 5:"');
		var random = Math.floor(Math.random() * 9);
		switch(random){
			case 0:
				dialogue.say('"Electric Blue-galoo"');
				break;
			case 1:
				dialogue.say('"Spooky Buddies"');
				break;
			case 2:
				dialogue.say('"A Good Day to Avatar"');
				break;
			case 3:
				dialogue.say('"Avatar Genisys"');
				break;
			case 4:
				dialogue.say('"The Source"');
				break;
			case 5:
				dialogue.say('"The Holiday Heist"');
				break;
			case 6:
				dialogue.say('"Avataring Dawn - Part II"');
				break;
			case 7:
				dialogue.say('"The Avatar Frontier"');
				break;
			case 8:
				dialogue.say('"Jason Avatar"');
				break;
		}
	};
	poster3.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't.");
	poster3.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'll just have to pay for it if I do.");
	poster3.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's not moving.");
	poster3.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'll just have to pay for it if I do.");
	poster3.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't.");
	poster3.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("No.");
	poster3.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I can't.");
	poster3.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("I can't.");
	poster3.draw = function(){};

	var poster4 = new this.objects.Object("Poster", 274, 122, scene.sceneNames.THEATER_EXT);
	poster4.width = posterSize.x;
	poster4.height = posterSize.y;
	poster4.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay('"YA Novel: The Movie"');
	poster4.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't.");
	poster4.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'll just have to pay for it if I do.");
	poster4.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's not moving.");
	poster4.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'll just have to pay for it if I do.");
	poster4.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't.");
	poster4.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello poster.");
	poster4.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I can't.");
	poster4.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("I can't.");
	poster4.draw = function(){};


	var haveClaw = false;
	var trash = new this.objects.Object("Trash Can", 348, 180, scene.sceneNames.THEATER_EXT);
	trash.width = tallSize.x;
	trash.height = tallSize.y;
	trash.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
		dialogue.say("It's a trash can.");
		dialogue.say("...hmm, there's something interesting in there...");
		dialogue.say("...but I'm not reaching in to find out what.");
	};
	trash.actionFuncs[ACTIONS.USE] = function(dialogue, player){
		if(player.useGiveItem == undefined){
			dialogue.say("I don't need to throw anything away.");
		} else {
			switch(player.useGiveItem) {
				case toyRobotClaw:
					if(haveClaw == true){
						dialogue.say("I dont need to do that again.");
						return;
					}
					haveClaw = true;
					dialogue.say("I've got something!");
					dialogue.say("It's an old trophy!");
					player.addToInventory(trophy);
					trophy.inInventory = true;
					trash.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("Nothing but trash in there now.");
					break;
				default:
					dialogue.say("I don't need to throw that away.");
			}
		}
	};
	trash.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I don't want the trash can.");
	trash.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I'd rather not.");
	trash.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'd rather not.");
	trash.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("Who would want it?");
	trash.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, trash.");
	trash.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I'm perfectly comfortable with keeping it closed.");
	trash.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's already closed");



	var trophy = new this.objects.Object("Old Trophy", -100, -100, scene.sceneNames.THEATER_EXT);
	trophy.width = invSize.x;
	trophy.height = invSize.y;
	trophy.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
		dialogue.say("It's really old.");
		dialogue.say("I can't read it through the dirt and grime.");
	};
	trophy.actionFuncs[ACTIONS.USE] = function(dialogue){
		if(player.useGiveItem == undefined){
			if(this.inInventory == false)
				dialogue.say("I can't use it if I don't have it.");
			else
				player.useGiveItem = this;
		} else {
			dialogue.say("I can't use those two things together");
		}
	};
	trophy.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I already have it.");
	trophy.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's just a trophy.");
	trophy.actionFuncs[ACTIONS.PULL] = utility.QuickSay("It's just a trophy.");
	trophy.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("Who would want it?");
	trophy.actionFuncs[ACTIONS.TALK_TO] = function(dialogue){
		dialogue.say("Hello, trophy.");
		dialogue.say("What secrets do you hold?");
	};
	trophy.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("It's just a trophy.");
	trophy.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's just a trophy.");




	objList.push(theaterToBusStop);
	objList.push(theaterDoor);
	objList.push(poster1);
	objList.push(poster2);
	objList.push(poster3);
	objList.push(poster4);
	objList.push(trash);
	objList.push(trophy);


































	/*****************************\

		THEATER INTERIOR SCENE

	\*****************************/




	
	/*
		THEATER DOOR
	*/
	var theaterExit = new this.objects.Object("Theater Door", 320, 284, scene.sceneNames.THEATER_INT);
	theaterExit.width = 320;
	theaterExit.height = 40;
	theaterExit.draw = function(){};
	theaterExit.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the theater exit.");
	theaterExit.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.THEATER_EXT;
		mackenzie.scene = scene.sceneNames.THEATER_EXT;

		player.position.x = 536;		// Position coordinates must be set individually
		player.position.y = 230;		// to avoid creating new object
		player.destination.x = 424;
		player.destination.y = 240;
		mackenzie.position.x = 496;
		mackenzie.position.y = 250;
	};
	theaterExit.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");


	var theaterInnerDoor = new this.objects.Object("Inner Theater Door", 156, 110, scene.sceneNames.THEATER_INT);
	theaterInnerDoor.width = 120;
	theaterInnerDoor.height = 120;
	theaterInnerDoor.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It goes into the theater part of the theater.");
	theaterInnerDoor.actionFuncs[ACTIONS.USE] = utility.QuickSay("I don't want to see a movie.");
	theaterInnerDoor.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how doors work.");
	theaterInnerDoor.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I don't want to see a movie.");
	theaterInnerDoor.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I don't want to see a movie.");
	theaterInnerDoor.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("That's not how doors work.");
	theaterInnerDoor.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello door.");
	theaterInnerDoor.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I don't want to see a movie.");
	theaterInnerDoor.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's already closed");
	theaterInnerDoor.useWith = false;
	theaterInnerDoor.draw = function(){};



	// Pay phone
	var haveLadyNumber = false;
	var payPhone = new this.objects.Object("Pay Phone", 282, 118, scene.sceneNames.THEATER_INT);
	payPhone.width = tallSize.x;
	payPhone.height = tallSize.y;
	payPhone.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's a pay phone.");
	payPhone.actionFuncs[ACTIONS.USE] = function(dialogue){
		if(player.useGiveItem == undefined){
			dialogue.say("I can't do that.");
		} else {
			switch (player.useGiveItem){
				case quarter:
					if(haveLadyNumber == true){
						dialogue.say("I'm gonna call Agnes...");
						dialogue.say("...see if I can't get her away from that door.");
						dialogue.say("...");
						dialogue.say(".....");
						dialogue.say("Hello, is this Agnes Fishwater?");
						dialogue.say("...");
						dialogue.say("Yes this is...");
						dialogue.say("Gerard...");
						dialogue.say("Butter...");
						dialogue.say("*sigh*", 1);
						dialogue.say("...calling you from...");
						dialogue.say("...uh...");
						dialogue.say("Fitness Place.", 1);
						dialogue.say("Fitness Place..." );
						dialogue.say("And I'm... Leslie.", 1);
						dialogue.say("This is my associate Leslie... Nelson.");
						dialogue.say("We're calling to let you know...");
						dialogue.say("...that your membership expires in an hour.", 1);
						dialogue.say("We've been trying to get ahold of you for days.");
						dialogue.say("...");
						dialogue.say("Yes ma'am, you'll need to come in right away.", 1);
						dialogue.say("We need you to renew your membership.", 1);
						dialogue.say("...");
						dialogue.say("The guys at the desk may not know about this.");
						dialogue.say("You may have to convince them.", 1);
						dialogue.say("They don't pay attention to things like this.");
						dialogue.say("But I'm sure eventually we'll get you squared away.");
						dialogue.say("Thank you for your time, bye.", 1);
						dialogue.say("Bye.");
						dialogue.say("...");
						dialogue.say("You know, I think that worked.");

						pizzaVillain.position.x = -100;
						pizzaVillain.position.y = -100;
						objList.push(goInPizza);
						player.removeFromInventory("Quarter");

					} else {
						dialogue.say("I don't have anyone to call.");
					}
					break;
				default:
					dialogue.say("I can't use those things together.");
			}
		}
	};
	payPhone.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I need a quarter.");
	payPhone.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I can push buttons all I want but I don't have any quarters.");
	payPhone.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I need a quarter.");
	payPhone.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("It's attached to the wall.");
	payPhone.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("I need a quarter.");
	payPhone.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("That's not how phones work.");
	payPhone.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("That's not how phones work.");
	//payPhone.useWith = false;
	//payPhone.draw = function(){};




	// Vending Machine
	var sawBottle = false;
	var vendingMachine = new this.objects.Object("Vending Machine", 582, 122, scene.sceneNames.THEATER_INT);
	vendingMachine.width = tallSize.x;
	vendingMachine.height = tallSize.y;
	vendingMachine.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
		dialogue.say("It's a vending machine.");
		if(sawBottle == true)
			return;
		sawBottle = true;
		dialogue.say("Oh. Huh.");
		dialogue.say("Looks like someone left their drink.");
		vendingMachine.name = "Vending Machine (with drink)";
		vendingMachine.actionFuncs[ACTIONS.PICK_UP] = function(dialogue){
			dialogue.say("I'll just grab that bottle.");
			vendingMachine.name = "Vending Machine";
			vendingMachine.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("It's a little too heavy for that.");
			player.addToInventory(bottle);
		};
	};
	vendingMachine.actionFuncs[ACTIONS.USE] = utility.QuickSay("I don't want a drink.");
	vendingMachine.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("It's a little too heavy for that.");
	vendingMachine.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("That's more trouble than it's worth.");
	vendingMachine.actionFuncs[ACTIONS.PULL] = utility.QuickSay("That's more trouble than it's worth.");
	vendingMachine.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I don't think you understand how vending machines work.");
	vendingMachine.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, vending machine.");
	vendingMachine.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I can't do that.");
	vendingMachine.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("I can't do that.");


	var bottle = new this.objects.Object("Bottle", -100, -100, scene.sceneNames.THEATER_INT);
	bottle.width = invSize.x;
	bottle.height = invSize.y;
	var openBottle = function(dialogue){
		dialogue.say("Whoops!");
		dialogue.say("It spilled everywhere when the cap came off!");
		player.addToInventory(bottlecap);
		bottle.actionFuncs[ACTIONS.USE] = utility.QuickSay("It's empty.");
		bottle.actionFuncs[ACTIONS.PULL] = utility.QuickSay("It's empty.");
		bottle.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("It's already open.");;
		bottle.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("Nah.");
		bottle.draw = function(ctx, scene){
			this.anims[1].draw(ctx, this.position.x, this.position.y);
		}

	};
	bottle.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's a soda bottle.");
	bottle.actionFuncs[ACTIONS.USE] = openBottle;
	bottle.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I already have it.");
	bottle.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's just a bottle.");
	bottle.actionFuncs[ACTIONS.PULL] = openBottle;
	bottle.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("No one would want it.");
	bottle.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, bottle.");
	bottle.actionFuncs[ACTIONS.OPEN] = openBottle;
	bottle.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's already closed.");


	var bottlecap = new this.objects.Object("Bottle Cap", -100, -100, scene.sceneNames.THEATER_INT);
	bottlecap.width = invSize.x;
	bottlecap.height = invSize.y;
	bottlecap.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's gray and has a president's face on it.");
	bottlecap.actionFuncs[ACTIONS.USE] = utility.QuickSay("It's just a bottle cap.");
	bottlecap.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I already have it.");
	bottlecap.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's just a bottle cap.");
	bottlecap.actionFuncs[ACTIONS.PULL] = utility.QuickSay("It's just a bottle cap.");
	bottlecap.actionFuncs[ACTIONS.GIVE] = function(dialogue){
		if(player.useGiveItem == undefined)
			player.useGiveItem = bottlecap;
		else
			dialogue.say("That's not gonna work.");
	};
	bottlecap.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, bottle cap.");
	bottlecap.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("It's just a bottle cap.");;
	bottlecap.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's just a bottle cap.");





	var coinFlipper = new this.objects.Object("Man", 106, 208, scene.sceneNames.THEATER_INT);
	coinFlipper.width = tallSize.x;
	coinFlipper.height = tallSize.y;
	coinFlipper.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("He's casually flipping a coin.");
	coinFlipper.actionFuncs[ACTIONS.USE] = utility.QuickSay("I'm not that kind of person.");
	coinFlipper.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'm already in a serious relationship'.");
	coinFlipper.actionFuncs[ACTIONS.PUSH] = function(dialogue){
		
		dialogue.say("Watch it you...", 4);
		dialogue.say("...you...", 4);
		dialogue.say("My coin!", 4);
		dialogue.say("I'VE DROPPED MY COIN!", 4);
		dialogue.say("Where is it?", 4);
		dialogue.say("I can't find it!", 4);

		coinFlipper.draw = function(ctx, scene){
			if(scene.currentScene != this.scene) 
				return;
			coinFlipper.anims[1].draw(ctx, coinFlipper.position.x, coinFlipper.position.y);
		};
		
		quarter.position.x = 214;
		quarter.position.y = 216;

		coinFlipper.actionFuncs[ACTIONS.TALK_TO] = function(dialogue){
			dialogue.say("Where's my coin? WHERE'S MY COIN??", 4);
		};
		coinFlipper.actionFuncs[ACTIONS.GIVE] = function(dialogue, player){
			if(player.useGiveItem == undefined){
				dialogue.say("I can't do that.");
			} else {
				switch(player.useGiveItem) {
					case bottlecap:
						player.removeFromInventory("Bottle Cap");
						dialogue.say("We found your coin!");
						dialogue.say("Oh, thank you! I was simply lost without it!", 4);

						coinFlipper.draw = function(ctx, scene){
							if(scene.currentScene != this.scene) 
								return;
							coinFlipper.anims[0].draw(ctx, coinFlipper.position.x, coinFlipper.position.y);
						};

						coinFlipper.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("He's casually flipping a bottle cap.");

						quarter.actionFuncs[ACTIONS.PICK_UP] = function(){
							player.addToInventory(quarter);
							quarter.draw = function(ctx, scene){
								this.anims[1].draw(ctx, this.position.x, this.position.y);
							}
							quarter.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's a quarter.");
						};

						coinFlipper.actionFuncs[ACTIONS.TALK_TO] = function(dialogue){
							dialogue.discourseOptions = coinDialogue;
						};
						break;
					default:
						dialogue.say("They won't want that.");
				}
			}
		};
	};
	coinFlipper.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I can't do that.");
	coinFlipper.actionFuncs[ACTIONS.GIVE] = function(dialogue){
		if(player.useGiveItem == undefined){
				dialogue.say("I can't do that.");
		} else {
			switch(player.useGiveItem) {
				case bottlecap:
					dialogue.say("This may vaguely resemble a quarter...");
					dialogue.say("...but I doubt he wants a second one.");
					break;
				default:
					dialogue.say("He won't want that.");
			}
		}
	};
	coinFlipper.actionFuncs[ACTIONS.TALK_TO] = function(dialogue){
		dialogue.discourseOptions = coinDialogue;
	};
	coinFlipper.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I can't do that.");
	coinFlipper.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("I can't do that.");
	var coinDialogue = [];
	coinDialogue.push({
		line : "What's up?",
		response : "I'm waiting to see a movie, of course.",
		speaker : 4,
		choices : coinDialogue,
		mousedOver : false
	});
	coinDialogue.push({
		line : "That's a nice coin you've got there.",
		response : "What a strange thing to say...",
		speaker : 4,
		moreTalk : function(dialogue){
			dialogue.say("But of course it is!", 4);
			dialogue.say("It's my lucky quarter.", 4);
			dialogue.say("I shall never part with it.", 4);
		},
		choices : coinDialogue,
		mousedOver : false
	});
	coinDialogue.push({
		line : "Can we have your quarter?",
		response : "Of course not!",
		speaker : 4,
		moreTalk : function(dialogue){
			dialogue.say('And it\'s "MAY we have your quarter".', 4);
		},
		choices : coinDialogue,
		mousedOver : false
	});
	coinDialogue.push({
		line : "*snap* SLEEP!",
		response : "What are you doing, young man?",
		speaker : 4,
		moreTalk : utility.QuickSay("Damn."),
		choices : coinDialogue,
		mousedOver : false
	});
	coinDialogue.push({
		line : "Bye.",
		response : "Goodbye, young ones.",
		speaker : 4,
		choices : undefined,
		mousedOver : false
	});

	var quarter = new this.objects.Object("Quarter", -100, -100, scene.sceneNames.THEATER_INT);
	quarter.width = invSize.x;
	quarter.height = invSize.y;
	quarter.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
		dialogue.say("It's the man's quarter.");
		dialogue.say("He hasn't noticed it.");
	};
	quarter.actionFuncs[ACTIONS.USE] = function(dialogue){
		if(quarter.inInventory == false){
			dialogue.say("I can't do that.");
			return;
		}

		if(player.useGiveItem == undefined)
			player.useGiveItem = quarter;
		else
			dialogue.say("I can't do that.");
	};
	quarter.actionFuncs[ACTIONS.PICK_UP] = function(dialogue){
		dialogue.say("If I pick it up now, he'll see me.");
		dialogue.say("He has to stop looking for it first.");
	};
	quarter.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("It's just a quarter.");
	quarter.actionFuncs[ACTIONS.PULL] = utility.QuickSay("It's just a quarter.");
	quarter.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I don't need to give this to anyone.");
	quarter.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, quarter.");
	quarter.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("It's just a quarter.");;
	quarter.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's just a quarter.");




	objList.push(quarter);
	objList.push(coinFlipper);
	objList.push(theaterExit);
	objList.push(theaterInnerDoor);
	objList.push(payPhone);
	objList.push(vendingMachine);
	objList.push(bottle);
	objList.push(bottlecap);




































	/******************\

		PARKING LOT

	\******************/




	/*
		PATH TO BUS STOP
	*/
	var lotToBus = new this.objects.Object("Bus Stop", 610, 480, scene.sceneNames.PARKING_LOT);
	lotToBus.width = 60;
	lotToBus.height = 480;
	lotToBus.draw = function(){};
	lotToBus.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the path to the bus stop.");
	lotToBus.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.BUS_STOP;
		mackenzie.scene = scene.sceneNames.BUS_STOP;

		player.position.x = -50;		// Position coordinates must be set individually
		player.position.y = 200;		// to avoid creating new object
		player.destination.x = 150;
		player.destination.y = 200;
		mackenzie.position.x = -100;
		mackenzie.position.y = 200;
	};
	lotToBus.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");




	var pizzaPlace = new this.objects.Object("Pizza Place", 190, 66, scene.sceneNames.PARKING_LOT);
	pizzaPlace.width = 150;
	pizzaPlace.height = 56;
	pizzaPlace.draw = function(){};
	pizzaPlace.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the pizza place.");
	pizzaPlace.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.PIZZA_EXT;
		mackenzie.scene = scene.sceneNames.PIZZA_EXT;

		player.position.x = 320;		// Position coordinates must be set individually
		player.position.y = 400;		// to avoid creating new object
		player.destination.x = 320;
		player.destination.y = 200;
		mackenzie.position.x = 320;
		mackenzie.position.y = 500;
	};
	pizzaPlace.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");




	var fitnessPlace = new this.objects.Object("Gym", 360, 66, scene.sceneNames.PARKING_LOT);
	fitnessPlace.width = 150;
	fitnessPlace.height = 56;
	fitnessPlace.draw = function(){};
	fitnessPlace.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's some fitness place.");
	fitnessPlace.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.FITNESS;
		mackenzie.scene = scene.sceneNames.FITNESS;

		player.position.x = 320;		// Position coordinates must be set individually
		player.position.y = 400;		// to avoid creating new object
		player.destination.x = 320;
		player.destination.y = 200;
		mackenzie.position.x = 320;
		mackenzie.position.y = 500;
	};
	fitnessPlace.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");



	objList.push(fitnessPlace);
	objList.push(pizzaPlace);
	objList.push(lotToBus);


































	/********************\

		FITNESS PLACE

	\********************/



	/*
		BACK TO LOT
	*/
	var fitnessToLot = new this.objects.Object("Parking Lot", 320, 284, scene.sceneNames.FITNESS);
	fitnessToLot.width = 640;
	fitnessToLot.height = 40;
	fitnessToLot.draw = function(){};
	fitnessToLot.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the parking lot.");
	fitnessToLot.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.PARKING_LOT;
		mackenzie.scene = scene.sceneNames.PARKING_LOT;

		player.position.x = 350;		// Position coordinates must be set individually
		player.position.y = 188;		// to avoid creating new object
		player.destination.x = 350;
		player.destination.y = 250;
		mackenzie.position.x = 350;
		mackenzie.position.y = 188;
	};
	fitnessToLot.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");



	/*
		TO PIZZA
	*/
	var fitnessToPizza = new this.objects.Object("Pizza Place", 30, 480, scene.sceneNames.FITNESS);
	fitnessToPizza.width = 60;
	fitnessToPizza.height = 480;
	fitnessToPizza.draw = function(){};
	fitnessToPizza.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the pizza place.");
	fitnessToPizza.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.PIZZA_EXT;
		mackenzie.scene = scene.sceneNames.PIZZA_EXT;

		player.position.x = 700;		// Position coordinates must be set individually
		player.position.y = 200;		// to avoid creating new object
		player.destination.x = 490;
		player.destination.y = 200;
		mackenzie.position.x = 750;
		mackenzie.position.y = 200;
	};
	fitnessToPizza.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");



	// Fitness Door
	var fitnessDoor = new this.objects.Object("Gym Door", 458, 184, scene.sceneNames.FITNESS);
	fitnessDoor.width = 74;
	fitnessDoor.height = 120;
	fitnessDoor.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the door to the fitness place.");
	fitnessDoor.actionFuncs[ACTIONS.USE] = function(dialogue){
		dialogue.say("No.");
		dialogue.say("No.", 1);
	};
	fitnessDoor.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how doors work.");
	fitnessDoor.actionFuncs[ACTIONS.PUSH] = function(dialogue){
		dialogue.say("No.");
		dialogue.say("No.", 1);
	};
	fitnessDoor.actionFuncs[ACTIONS.PULL] = function(dialogue){
		dialogue.say("No.");
		dialogue.say("No.", 1);
	};
	fitnessDoor.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("That's not how doors work.");
	fitnessDoor.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, door.");
	fitnessDoor.actionFuncs[ACTIONS.OPEN] = function(dialogue){
		dialogue.say("No.");
		dialogue.say("No.", 1);
	};
	fitnessDoor.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's closed.");
	fitnessDoor.useWith = false;
	fitnessDoor.draw = function(){};


	// Windows
	var fitWindConst = function(x, y, objects, PLAYER_ACTION){
		var f = new objects.Object("Gym Window", x, y, scene.sceneNames.FITNESS);
		f.width = 190;
		f.height = 100;
		f.actionFuncs[PLAYER_ACTION.LOOK_AT] = function(dialogue){
			dialogue.say("I can see people inside, exercising.");
			dialogue.say("It's chilling, really.");
		};
		f.actionFuncs[PLAYER_ACTION.USE] = utility.QuickSay("I can't do that.");
		f.actionFuncs[PLAYER_ACTION.PICK_UP] = utility.QuickSay("That's not how windows work.");
		f.actionFuncs[PLAYER_ACTION.PUSH] = utility.QuickSay("I can't do that.");
		f.actionFuncs[PLAYER_ACTION.PULL] = utility.QuickSay("I can't do that.");
		f.actionFuncs[PLAYER_ACTION.GIVE] = utility.QuickSay("That's not how windows work.");
		f.actionFuncs[PLAYER_ACTION.TALK_TO] = utility.QuickSay("Hello, window.");
		f.actionFuncs[PLAYER_ACTION.OPEN] = utility.QuickSay("I can't do that.");
		f.actionFuncs[PLAYER_ACTION.CLOSE] = utility.QuickSay("It's closed.");
		f.useWith = false;
		f.draw = function(){};
		return f;
	};


	// Fitness Guy
	var fitGuy = new this.objects.Object("Guy", 410, 200, scene.sceneNames.FITNESS);
	fitGuy.width = tallSize.x;
	fitGuy.height = tallSize.y;
	fitGuy.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("I guess he works here.");
	fitGuy.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't do that.");
	fitGuy.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'm in a relationship");
	fitGuy.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I want to, but I shouldn't.");
	fitGuy.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I can't do that.");
	fitGuy.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't do that.");
	fitGuy.actionFuncs[ACTIONS.TALK_TO] = function(dialogue){
		dialogue.say("Heya, I'm Josh!", 3);
		fitGuy.name = "Josh";
		dialogue.say("Can I interest you in a gym membership?", 3);
		dialogue.say("Sign up now and we'll get you rockin' and rollin'!", 3);
		dialogue.say("I already hate him.", 1);
		dialogue.discourseOptions = fitGuyDialogue.choices;
	};
	fitGuy.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I'm not a surgeon.");
	fitGuy.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("I can't do that.");
	fitGuy.useWith = false;
	fitGuy.draw = function(ctx, scene, dialogue){
		if(scene.currentScene != this.scene) 
			return;
		if(dialogue.lines.length > 0 &&
			dialogue.lines[0].character == 3){
			fitGuy.anims[1].draw(ctx, fitGuy.position.x, fitGuy.position.y);
		} else {
			fitGuy.anims[0].draw(ctx, fitGuy.position.x, fitGuy.position.y);
		}
	};

	var fitGuyDialogue = {};
	fitGuyDialogue.choices = [];
	fitGuyDialogue.choices.push({
		line : "I'm interested in a membership.",
		response : "Sorry, we're fresh out!",
		speaker : 3,
		choices : fitGuyDialogue.choices,
		mousedOver : false
	});
	fitGuyDialogue.choices.push({
		line : "Got any free samples?",
		response : "Here, take this free weight training tool!",
		speaker : 3,
		moreTalk : function(dialogue){
			player.addToInventory(toyRobotClaw);
			toyRobotClaw.inInventory = true;
			dialogue.say("...this is just a toy robot claw.");
			dialogue.say("Use it to build up your ABS!", 3);
			dialogue.say("Whatever you say.", 1);
			fitGuyDialogue.choices.splice(1, 1);
		},
		choices : fitGuyDialogue.choices,
		mousedOver : false
	});
	fitGuyDialogue.choices.push({
		line : "*snap* SLEEP!",
		response : "Dude, what?",
		speaker : 3,
		moreTalk : utility.QuickSay("Damn."),
		choices : fitGuyDialogue.choices,
		mousedOver : false
	});
	fitGuyDialogue.choices.push({
		line : "We have to go.",
		response : "Keep on rockin' and rollin'!",
		speaker : 3,
		choices : undefined,
		mousedOver : false
	});

	var pushedNumberRequest = false;
	var openDialogueWithJoshAboutLady = function(){
		fitGuyDialogue.choices.push({
			line : "What's the deal with that lady over there?",
			response : "Oh, that's just Agnes.",
			speaker : 3,
			moreTalk : function(dialogue){
				pizzaVillain.name = "Agnes";
				dialogue.say("She's in here all the time...", 3);
				dialogue.say("...ranting about the 'evils of pizza'...", 3);
				dialogue.say("She annoys the hell out of everyone...", 3);
				dialogue.say("...but hey, she's paying.", 3);
				if(pushedNumberRequest == true) return;
				pushedNumberRequest = true;
				fitGuyDialogue.choices.push({
					line : "Can you give me her phone number?",
					response : "That's private.",
					speaker : 3,
					moreTalk : function(dialogue){
						dialogue.say("Why would I give it to you?", 3);
						dialogue.say("Uh....");
					},
					choices : [
						{
							line : "...I'm married to her.",
							response : "Prove it.",
							speaker : 3,
							moreTalk : function(dialogue){
								dialogue.say("What are her kid's names?", 3);
							},
							choices : question1,
							mousedOver : false
						},
						{
							line : "...I'm her cousin.",
							response : "Prove it.",
							speaker : 3,
							moreTalk : function(dialogue){
								dialogue.say("What are her kid's names?", 3);
							},
							choices : question1,
							mousedOver : false
						},
						{
							line : "...She's my mother.",
							response : "Prove it.",
							speaker : 3,
							moreTalk : function(dialogue){
								dialogue.say("What are her kid's names?", 3);
							},
							choices : question1,
							mousedOver : false
						},
						{
							line : "...I'm her secret lover.",
							response : "Prove it.",
							speaker : 3,
							moreTalk : function(dialogue){
								dialogue.say("What are her kid's names?", 3);
							},
							choices : question1,
							mousedOver : false
						},
						{
							line : "...I'm her estranged father.",
							response : "...",
							speaker : 3,
							moreTalk : function(dialogue){
								dialogue.say(".....", 3);
								dialogue.say("Prove it.", 3);
								dialogue.say("What are her kid's names?", 3);
							},
							choices : question1,
							mousedOver : false
						},
						{
							line : "...Never mind.",
							response : undefined,
							speaker : 3,
							choices : fitGuyDialogue.choices,
							mousedOver : false
						},
					],
					mousedOver : false
				});
			},
			choices : fitGuyDialogue.choices,
			mousedOver : false
		});
	};

	var questioningScore = 0;

	var ladyNum = new this.objects.Object("Phone Number", -100, -100, 0);
	ladyNum.width = invSize.x;
	ladyNum.height = invSize.y;
	ladyNum.inInventory = true;
	ladyNum.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's Agnes' phone number.");
	ladyNum.actionFuncs[ACTIONS.USE] = utility.QuickSay("I just need to find a phone.");
	ladyNum.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I already have it.");
	ladyNum.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("What?");
	ladyNum.actionFuncs[ACTIONS.PULL] = utility.QuickSay("What?");
	ladyNum.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I'm not just gonna give out someone else's number.");
	ladyNum.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, piece of paper with a phone number on it.");
	ladyNum.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("It's a piece of paper.");
	ladyNum.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's a piece of paper.");
	ladyNum.useWith = false;


	var fitnessGuyQuestionsEnd = function(dialogue){
		if(questioningScore < 4){
			questioningScore = 0;
			dialogue.say("I don't believe that you are who you say you are.", 3);
		} else {
			dialogue.say("Well, I guess you are who you say you are.", 3);
			dialogue.say("Here's her number.", 3);
			fitGuyDialogue.choices.splice(fitGuyDialogue.choices.length - 1, 1);
			player.addToInventory(ladyNum);
			haveLadyNumber = true;
		}
	};

	var question4Gen = function(){
		var choices = [];
		for(var n = 0; n < 4; ++n){
			var year = Math.round(Math.random() * 60 + 1950);
			if(year == 1990) year = 1991;
			choices.push({
				line : year + ".",
				response : undefined,
				speaker : 3,
				moreTalk : fitnessGuyQuestionsEnd,
				choices : fitGuyDialogue.choices,
				mousedOver : false
			});
		}
		return choices;
	};
	// How does she usually exercise here?
	var question3 = [
		{
			line : "She runs on a treadmill.",
			response : "What year did she win the regional soccer tourney?",
			speaker : 3,
			moreTalk : function(){
				addSoccerQuestion();
				this.choices = question4Gen();
			},
			mousedOver : false
		},
		{
			line : "She bench presses.",
			response : "What year did she win the regional soccer tourney?",
			speaker : 3,
			moreTalk : function(){
				++questioningScore;
				addSoccerQuestion();
				this.choices = question4Gen();
			},
			mousedOver : false
		},
		{
			line : "She works on her calves.",
			response : "What year did she win the regional soccer tourney?",
			speaker : 3,
			moreTalk : function(){
				addSoccerQuestion();
				this.choices = question4Gen();
			},
			mousedOver : false
		},
		{
			line : "She does gymnastics.",
			response : "What year did she win the regional soccer tourney?",
			speaker : 3,
			moreTalk : function(){
				addSoccerQuestion();
				this.choices = question4Gen();
			},
			mousedOver : false
		}
	];
	// Where does she live?
	var question2 = [
		{
			line : "Billerica.",
			response : "How does she usually exercise here?",
			speaker : 3,
			choices : question3,
			mousedOver : false
		},
		{
			line : "Wisconsin. She's been visiting.",
			response : "How does she usually exercise here?",
			speaker : 3,
			choices : question3,
			mousedOver : false
		},
		{
			line : "Just down the street.",
			response : "How does she usually exercise here?",
			speaker : 3,
			choices : question3,
			mousedOver : false
		},
		{
			line : "In a nearby apartment complex.",
			response : "How does she usually exercise here?",
			speaker : 3,
			moreTalk : function(dialogue){
				++questioningScore;
			},
			choices : question3,
			mousedOver : false
		}
	];
	// What are her kid's names?
	var question1 = [
		{
			line : "Stan and Oliver",
			response : "Where does she live?",
			speaker : 3,
			moreTalk : function(dialogue){
				++questioningScore;
			},
			choices : question2,
			mousedOver : false
		},
		{
			line : "Bud and Lou",
			response : "Where does she live?",
			speaker : 3,
			choices : question2,
			mousedOver : false
		},
		{
			line : "Jonathan and Will",
			response : "Where does she live?",
			speaker : 3,
			choices : question2,
			mousedOver : false
		},
		{
			line : "Wednesday and Pugsley",
			response : "Where does she live?",
			speaker : 3,
			choices : question2,
			mousedOver : false
		}
	];




	var toyRobotClaw = new this.objects.Object("Toy Robot Claw", -100, -100, 0);
	toyRobotClaw.width = invSize.x;
	toyRobotClaw.height = invSize.y;
	toyRobotClaw.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's a toy robot claw.");
	toyRobotClaw.actionFuncs[ACTIONS.USE] = function(dialogue){
		if(player.useGiveItem == undefined){
			if(this.inInventory == false)
				dialogue.say("I can't use it if I don't have it.");
			else
				player.useGiveItem = this;
		} else {
			dialogue.say("I can't use those two things together");
		}
	};
	toyRobotClaw.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I already have it.");
	toyRobotClaw.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("Doesn't work like that.");
	toyRobotClaw.actionFuncs[ACTIONS.PULL] = utility.QuickSay("Doesn't work like that.");
	toyRobotClaw.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I think I'll keep this.");
	toyRobotClaw.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, toy robot claw.");
	toyRobotClaw.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("Playing with it doesn't do much for me.");
	toyRobotClaw.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("Playing with it doesn't do much for me.");







	objList.push(fitGuy);
	objList.push(fitnessToLot);
	objList.push(fitnessToPizza);
	objList.push(fitnessDoor);
	objList.push(fitWindConst(118, 138, this.objects, ACTIONS));
	objList.push(fitWindConst(318, 138, this.objects, ACTIONS));
	objList.push(fitWindConst(604, 138, this.objects, ACTIONS));
	objList.push(toyRobotClaw);
	objList.push(ladyNum);

































	/********************\

		PIZZA EXT

	\********************/



	/*
		BACK TO LOT
	*/
	var pizzaToLot = new this.objects.Object("Parking Lot", 320, 284, scene.sceneNames.PIZZA_EXT);
	pizzaToLot.width = 640;
	pizzaToLot.height = 40;
	pizzaToLot.draw = function(){};
	pizzaToLot.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the parking lot.");
	pizzaToLot.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.PARKING_LOT;
		mackenzie.scene = scene.sceneNames.PARKING_LOT;

		player.position.x = 200;		// Position coordinates must be set individually
		player.position.y = 188;		// to avoid creating new object
		player.destination.x = 200;
		player.destination.y = 250;
		mackenzie.position.x = 200;
		mackenzie.position.y = 188;
	};
	pizzaToLot.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");




	/*
		TO FITNESS
	*/
	var pizzaToFitness = new this.objects.Object("Gym", 610, 480, scene.sceneNames.PIZZA_EXT);
	pizzaToFitness.width = 60;
	pizzaToFitness.height = 480;
	pizzaToFitness.draw = function(){};
	pizzaToFitness.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the fitness place.");
	pizzaToFitness.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.FITNESS;
		mackenzie.scene = scene.sceneNames.FITNESS;

		player.position.x = -50;		// Position coordinates must be set individually
		player.position.y = 200;		// to avoid creating new object
		player.destination.x = 150;
		player.destination.y = 200;
		mackenzie.position.x = -100;
		mackenzie.position.y = 200;
	};
	pizzaToFitness.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");



	/*
		TO INTERIOR
	*/
	var goInPizza = new this.objects.Object("Pizza Place Entrance", 184, 184, scene.sceneNames.PIZZA_EXT);
	goInPizza.width = 85;
	goInPizza.height = 130;
	goInPizza.draw = function(){};
	goInPizza.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the entrance to the pizza place.");
	goInPizza.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.PIZZA_INT;
		mackenzie.scene = scene.sceneNames.PIZZA_INT;

		player.position.x = 534;		// Position coordinates must be set individually
		player.position.y = 200;		// to avoid creating new object
		player.destination.x = 436;
		player.destination.y = 200;
		mackenzie.position.x = 520;
		mackenzie.position.y = 230;
	};
	goInPizza.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");



	// Pizza Sign
	var pizzaSign = new this.objects.Object("Neon Sign", 488, 98, scene.sceneNames.PIZZA_EXT);
	pizzaSign.width = posterSize.x;
	pizzaSign.height = posterSize.y;
	pizzaSign.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's a neon pizza sign.");
	pizzaSign.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't.");
	pizzaSign.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'll just get arrested.");
	pizzaSign.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I'd rather not.");
	pizzaSign.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'd rather not.");
	pizzaSign.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't.");
	pizzaSign.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, sign.");
	pizzaSign.draw = function(){};

	// Windows
	var pizzaWindow1 = new this.objects.Object("Window", 388, 132, scene.sceneNames.PIZZA_EXT);
	pizzaWindow1.width = 70;
	pizzaWindow1.height = 80;
	pizzaWindow1.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("I can see people inside, enjoying their pizza.");
	pizzaWindow1.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't.");
	pizzaWindow1.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I can't.");
	pizzaWindow1.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I'd rather not.");
	pizzaWindow1.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'd rather not.");
	pizzaWindow1.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't.");
	pizzaWindow1.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("No one inside would hear me.");
	pizzaWindow1.draw = function(){};
	
	var pizzaWindow2 = new this.objects.Object("Window", 68, 132, scene.sceneNames.PIZZA_EXT);
	pizzaWindow2.width = 70;
	pizzaWindow2.height = 80;
	pizzaWindow2.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("I can see people inside, enjoying their pizza.");
	pizzaWindow2.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't.");
	pizzaWindow2.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I can't.");
	pizzaWindow2.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I'd rather not.");
	pizzaWindow2.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'd rather not.");
	pizzaWindow2.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't.");
	pizzaWindow2.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("No one inside would hear me.");
	pizzaWindow2.draw = function(){};



	var pizzaVillain = new this.objects.Object("Woman", 184, 188, scene.sceneNames.PIZZA_EXT);
	pizzaVillain.width = tallSize.x;
	pizzaVillain.height = tallSize.y;
	pizzaVillain.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's a woman and her kids, blocking the door.");
	pizzaVillain.actionFuncs[ACTIONS.USE] = utility.QuickSay("I can't.");
	pizzaVillain.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'm in a relationship already.");
	pizzaVillain.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I'd rather not.");
	pizzaVillain.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'd rather not.");
	pizzaVillain.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I can't.");
	pizzaVillain.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("I'm not a surgeon.");
	pizzaVillain.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("I can't do that.");
	pizzaVillain.actionFuncs[ACTIONS.TALK_TO] = function(dialogue){
		openDialogueWithJoshAboutLady();
		openDialogueWithJoshAboutLady = function(){};
		dialogue.discourseOptions = villainDialogue.choices;
	};

	pizzaVillain.draw = function(ctx, scene, dialogue){
		if(scene.currentScene != this.scene) 
			return;
		if(dialogue.lines.length > 0 &&
			dialogue.lines[0].character == 2){
			pizzaVillain.anims[1].draw(ctx, pizzaVillain.position.x, pizzaVillain.position.y);
		} else {
			pizzaVillain.anims[0].draw(ctx, pizzaVillain.position.x, pizzaVillain.position.y);
		}
	};

	var villainDialogue = {};
	villainDialogue.choices = [];

	var rantP1 = {
		line : "Do you like the pizza here?",
		response : "No I do not like the pizza here.",
		speaker : 2,
		moreTalk : function(dialogue){
			dialogue.say("In fact, I don't like pizza at all!", 2);
			dialogue.say("It's disgusting...", 2);
			dialogue.say("It's unhealthy...", 2);
			dialogue.say("And no one should eat it!", 2);

			villainDialogue.choices[1] = rantP2
		},
		choices : villainDialogue.choices,
		mousedOver : false
	};

	var rantP2 = {
		line : "Is there any particular reason you don't like pizza?",
		response : "WERE YOU NOT JUST LISTENING?",
		speaker : 2,
		moreTalk : function(dialogue){
			dialogue.say("No one should be eating pizza!", 2);
			dialogue.say("It's terrible!", 2);
			dialogue.say("Stan and Olly hate it, don't you boys?", 2);
			dialogue.say("...", 2);
			dialogue.say("...", 2);
			dialogue.say("Get out of here, you punks.", 2);

			villainDialogue.choices[1] = rantP3
		},
		choices : villainDialogue.choices,
		mousedOver : false
	};

	var rantP3 = {
		line : "Do you just stand here all day?",
		response : "It's better than my lousy apartment!",
		speaker : 2,
		moreTalk : function(dialogue){
			dialogue.say("This city needs better apartments!", 2);

			villainDialogue.choices[1] = rantP4
		},
		choices : villainDialogue.choices,
		mousedOver : false
	};

	var rantP4 = {
		line : "But isn't there anything else you'd rather be doing?",
		response : "No, there is not.",
		speaker : 2,
		moreTalk : function(dialogue){
			dialogue.say("If it were Monday, Wednesday, or Friday, maybe.", 2);
			dialogue.say("Then I would be bench pressing TWICE MY WEIGHT.", 2);
			dialogue.say("But it's not Monday, Wednesday or Friday...", 2);
			dialogue.say("IS IT?", 2);

			villainDialogue.choices[1] = rantP1
		},
		choices : villainDialogue.choices,
		mousedOver : false
	};

	villainDialogue.choices.push({
		line : "What's your name?",
		response : "None of your business, punk.",
		speaker : 2,
		choices : villainDialogue.choices,
		mousedOver : false
	});
	villainDialogue.choices.push(rantP1);
	villainDialogue.choices.push({
		line : "*snap* SLEEP!",
		response : "What are you doing?",
		speaker : 2,
		moreTalk : utility.QuickSay("Damn."),
		choices : villainDialogue.choices,
		mousedOver : false
	});
	villainDialogue.choices.push({
		line : "Excuse us, we'd like to get in.",
		response : "I will do no such thing!",
		speaker : 2,
		moreTalk : function(dialogue){
			dialogue.say("You kids shouldn't be eating pizza!", 2);
			dialogue.say("You realize this means war.", 1);
		},
		choices : villainDialogue.choices,
		mousedOver : false
	});
	villainDialogue.choices.push({
		line : "Bye",
		response : "Get out of here!",
		speaker : 2,
		choices : undefined,
		mousedOver : false
	});



	var addSoccerQuestion = function(){
		villainDialogue.choices.push({
		line : "Ever won any soccer tournaments?",
		response : "How DARE you ask such a personal question!",
		speaker : 4,
		moreTalk : function(dialogue){
			dialogue.say("I refuse to talk about it!", 4);
			dialogue.say("I've just finished removing it from my life...", 4);
			dialogue.say("...and I don't need punks like you bringing it up!", 4);
		},
		choices : villainDialogue.choices,
		mousedOver : false
	});
	};




	objList.push(pizzaVillain);
	objList.push(pizzaToLot);
	objList.push(pizzaToFitness);
	objList.push(pizzaSign);
	objList.push(pizzaWindow1);
	objList.push(pizzaWindow2);
	//objList.push(goInPizza);



























	/********************\

		PIZZA INT

	\********************/




	/*
		EXIT
	*/
	var exitPizza = new this.objects.Object("Pizza Place Exit", 590, 220, scene.sceneNames.PIZZA_INT);
	exitPizza.width = 40;
	exitPizza.height = 130;
	exitPizza.draw = function(){};
	exitPizza.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's the exit to the pizza place.");
	exitPizza.actionFuncs[ACTIONS.NONE] = function(dialogue, player){

		scene.currentScene = scene.sceneNames.PIZZA_EXT;
		mackenzie.scene = scene.sceneNames.PIZZA_EXT;

		player.position.x = 184;		// Position coordinates must be set individually
		player.position.y = 184;		// to avoid creating new object
		player.destination.x = 184;
		player.destination.y = 250;
		mackenzie.position.x = 200;
		mackenzie.position.y = 200;
	};
	exitPizza.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not how reality works.");



	// Pizza Crowd
	var pizzaCrowd = new this.objects.Object("Dining Area", 320, 284, scene.sceneNames.PIZZA_INT);
	pizzaCrowd.width = 640;
	pizzaCrowd.height = 50;
	pizzaCrowd.actionFuncs[ACTIONS.NONE] = utility.QuickSay("We need to get pizza first.");
	pizzaCrowd.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("Look at all those people enjoying their pizza");
	pizzaCrowd.actionFuncs[ACTIONS.USE] = utility.QuickSay("We need to get pizza first.");
	pizzaCrowd.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("That's not gonna work.");
	pizzaCrowd.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I'd rather not.");
	pizzaCrowd.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'd rather not.");
	pizzaCrowd.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("That's not gonna work.");
	pizzaCrowd.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("I don't want to talk to strangers.");
	pizzaCrowd.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("That's not gonna work.");
	pizzaCrowd.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("That's not gonna work.");



	// Pizza Worker
	var pizzaWorker = new this.objects.Object("Pizza Person", 40, 200, scene.sceneNames.PIZZA_INT);
	pizzaWorker.width = tallSize.x;
	pizzaWorker.height = tallSize.y;
	pizzaWorker.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("Looks like she works here.");
	pizzaWorker.actionFuncs[ACTIONS.USE] = utility.QuickSay("That's not how I roll.");
	pizzaWorker.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I'm already in a relationship.");
	pizzaWorker.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I'd rather not.");
	pizzaWorker.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'd rather not.");
	pizzaWorker.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("I don't have anything to give.");
	pizzaWorker.actionFuncs[ACTIONS.TALK_TO] = function(dialogue){
		dialogue.say("Hello, welcome to Pizza Place.", 5);
		dialogue.say("May I take your order?", 5);
		dialogue.say("We want a large pizza, please.", 1);
		dialogue.say("What do you want for sauce?", 5);
		dialogue.discourseOptions = sauceQuery;
	};
	pizzaWorker.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("That's not gonna work.");
	pizzaWorker.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("That's not gonna work.");

	pizzaWorker.draw = function(ctx, scene, dialogue){
		if(scene.currentScene != this.scene) 
			return;
		if(dialogue.lines.length > 0 &&
			dialogue.lines[0].character == 5){
			pizzaWorker.anims[1].draw(ctx, pizzaWorker.position.x, pizzaWorker.position.y);
		} else {
			pizzaWorker.anims[0].draw(ctx, pizzaWorker.position.x, pizzaWorker.position.y);
		}
	};




	var sauceQuery = [];
	var cheeseQuery = [];
	var toppingsQuery = [];


	sauceQuery.push({
		line : "Red sauce.",
		response : "And what would you like for cheese?",
		speaker : 5,
		moreTalk : function(dialogue){
			pSauce = "red sauce";
		},
		choices : cheeseQuery,
		mousedOver : false
	});
	sauceQuery.push({
		line : "Garlic and olive oil.",
		response : "And what would you like for cheese?",
		speaker : 5,
		moreTalk : function(dialogue){
			pSauce = "garlic and olive oil";
		},
		choices : cheeseQuery,
		mousedOver : false
	});
	sauceQuery.push({
		line : "Both.",
		response : "And what would you like for cheese?",
		speaker : 5,
		moreTalk : function(dialogue){
			pSauce = "both sauces";
		},
		choices : cheeseQuery,
		mousedOver : false
	});
	sauceQuery.push({
		line : "*snap* SLEEP!",
		response : "What?",
		speaker : 5,
		moreTalk : function(dialogue){
			dialogue.say("Damn.");
		},
		choices : sauceQuery,
		mousedOver : false
	});


	cheeseQuery.push({
		line : "Mozzarella",
		response : "And what would you like for toppings?",
		speaker : 5,
		moreTalk : function(dialogue){
			pCheese = "mozzarella cheese";
		},
		choices : toppingsQuery,
		mousedOver : false
	});
	cheeseQuery.push({
		line : "Parmesan",
		response : "And what would you like for toppings?",
		speaker : 5,
		moreTalk : function(dialogue){
			pCheese = "parmesan cheese";
		},
		choices : toppingsQuery,
		mousedOver : false
	});
	cheeseQuery.push({
		line : "Cheddar.",
		response : "And what would you like for toppings?",
		speaker : 5,
		moreTalk : function(dialogue){
			pCheese = "cheddar cheese";
		},
		choices : toppingsQuery,
		mousedOver : false
	});
	cheeseQuery.push({
		line : "All of them.",
		response : "And what would you like for toppings?",
		speaker : 5,
		moreTalk : function(dialogue){
			pCheese = "all the cheeses";
		},
		choices : toppingsQuery,
		mousedOver : false
	});
	cheeseQuery.push({
		line : "*snap* SLEEP!",
		response : "What?",
		speaker : 5,
		moreTalk : function(dialogue){
			dialogue.say("Damn.");
		},
		choices : cheeseQuery,
		mousedOver : false
	});


	toppingsQuery.push({
		line : "None.",
		response : "None? But what about-",
		speaker : 5,
		moreTalk : function(dialogue){
			dialogue.say("None.");
			dialogue.say("Alright, here you go!", 5);

			//pizza.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's our pizza with " + pSauce + " and " + pCheese + ".");
			pizza.actionFuncs[ACTIONS.LOOK_AT] = function(dialogue){
				dialogue.say("It's our pizza...");
				dialogue.say("...with " + pSauce + "...");
				dialogue.say("...and " + pCheese + ".");
			};
			player.addToInventory(pizza);
			pizzaCrowd.actionFuncs[ACTIONS.NONE] = endGame;
			pizzaCrowd.actionFuncs[ACTIONS.USE] = endGame;

			pizzaWorker.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("I already got my pizza.");
		},
		choices : undefined,
		mousedOver : false
	});
	toppingsQuery.push({
		line : "*snap* SLEEP!",
		response : "What?",
		speaker : 5,
		moreTalk : function(dialogue){
			dialogue.say("Damn.");
		},
		choices : toppingsQuery,
		mousedOver : false
	});
	

	var pSauce = "sauce";
	var pCheese = "cheese";

	var pizza = new this.objects.Object("Pizza", -100, -100, scene.sceneNames.PIZZA_INT);
	pizza.width = invSize.x;
	pizza.height = invSize.y;
	pizza.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's our pizza with " + pSauce + " and " + pCheese + ".");
	pizza.actionFuncs[ACTIONS.USE] = utility.QuickSay("Let's sit down first.");
	pizza.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("I already have it.");
	pizza.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("I'd rather not.");
	pizza.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I'd rather not.");
	pizza.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("This is just for us.");
	pizza.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Hello, pizza.");
	pizza.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("That's not gonna work.");
	pizza.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("That's not gonna work.");


	var endGame = function(dialogue){
		dialogue.say("Let's eat.");
		dialogue.say("Let's.", 1);
		game.gameOver = true;
	};



	
	objList.push(exitPizza);
	objList.push(pizzaCrowd);
	objList.push(pizzaWorker);
	objList.push(pizza);
	































	/*
		THE PHONE
	*/
	var phone = new this.objects.Object("Phone", 0, 0, 0);
	phone.width = invSize.x;
	phone.height = invSize.y;
	phone.inInventory = true;
	phone.actionFuncs[ACTIONS.LOOK_AT] = utility.QuickSay("It's my phone.");
	phone.actionFuncs[ACTIONS.USE] = function(dialogue){
		dialogue.say("Yeah, let me just...");
		dialogue.say("Oh.");
		dialogue.say("The battery's dead.");
		phone.actionFuncs[ACTIONS.USE] = utility.QuickSay("The battery's dead.");
	};
	phone.actionFuncs[ACTIONS.PICK_UP] = utility.QuickSay("It's not ringing.");
	phone.actionFuncs[ACTIONS.PUSH] = utility.QuickSay("Nah. I hate push notifications.");
	phone.actionFuncs[ACTIONS.PULL] = utility.QuickSay("I don't need to take it out.");
	phone.actionFuncs[ACTIONS.GIVE] = utility.QuickSay("Last time I gave someone my phone they called 911.");
	phone.actionFuncs[ACTIONS.TALK_TO] = utility.QuickSay("Siri, tell the player to stop messing with my phone.");
	phone.actionFuncs[ACTIONS.OPEN] = utility.QuickSay("It's not *that* old.");
	phone.actionFuncs[ACTIONS.CLOSE] = utility.QuickSay("It's not *that* old.");
	phone.useWith = false;
	objList.push(phone);
	this.player.addToInventory(phone);




};



