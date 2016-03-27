/*
============================================================================================================================================
														SPACE INVADERS DU PAUVRE
============================================================================================================================================
*/

//Here we go
var game = new Phaser.Game(600, 600, Phaser.AUTO, 'contentor', { preload: preload, create: create, update: update });

var player, enemies, items, shots, special_shots, enemy_shots, bonusships, explosions, shield; //Groups

var cursors, fire_btn, special_btn, mute_btn, pause_btn, restart_btn; //Inputs

var text_score, text_middle, text_level, text_ship, text_pause; //Texts

var timer;

//Audio
var mute = false;
var gameoversound = false;
var introduction_sound = true;
var music, pickup_sd, playerhit_sd, hitenemy_sd, killenemy_sd, abahe_sd, hellyeah_sd, fire_sd, firespecial_sd, enemyfire_sd, wave_sd, intro_sd, win_sd, over_sd;

var difficulty = 0; //-1 = EASY, 0 = NORMAL, 1 = HARD, 2 = OH GOD
console.log('Difficulty = ' + difficulty);

//Constants
var EASY = -1;
var NORMAL = 0;
var HARD = 1;
var OHGOD = 2;

var START_SPEED = 20;
var SPEEDUP_INIT = 5;
var SPEEDUP_ACCEL = 0.5;
var PLAYER_SPEED = 150;
var DEFAULTS = [START_SPEED, SPEEDUP_INIT, SPEEDUP_ACCEL];
var DEFAULT_FIRE_COOLDOWN = 30;
var ENEMY_DEFAULT_FIRE_PROBA = 0.004 + difficulty*0.001;
var POWERUP_CHANCE = 0.05 + difficulty*0.01;
var MAX_POWER = 7;
var MAX_CDR = 30;

var left = false;
var lostAlife = false;
var mute_wait = 0;
var speed, speedup, accel;
var current_level = 0;
var current_bonus_level = 0;
var in_bonus_level = false;
var score = 0;
var lives = 3;
var power = (difficulty == -1 ? 2 : 1);
var shield_time = 0;
var shots_cooldown = 0;
var special_cooldown = 0;
var special_available = 1;
var cooldown_reduction = 0;
var random = 1;

//Levels
var levels = [[[0,0,1,1,1,1,1,1,0,0], //Level 1
			 [0,1,1,1,1,1,1,1,1,0], //Orange is the new ghost
			 [1,1,1,1,1,1,1,1,1,1], //Alerte Orange
			 [1,1,1,1,1,1,1,1,1,1]],
			
			[[0,0,1,1,1,1,1,1,0,0], //Level 2
			 [0,1,1,1,1,1,1,1,1,0], //Cross the line
			 [2,2,2,2,2,2,2,2,2,2], //La ligne rouge
			 [1,1,1,1,1,1,1,1,1,1]],

			[[0,0,1,1,1,1,1,1,0,0], //Level 3
			 [0,1,1,1,1,1,1,1,1,0], //Death from above
			 [3,3,3,3,3,3,3,3,3,3], //La mort vient d'en haut
			 [3,3,3,3,3,3,3,3,3,3]],

			[[0,0,1,1,1,1,1,1,0,0], //Level 4
			 [0,4,4,4,4,4,4,4,4,0], //Still not bullet hell
			 [4,4,4,4,4,4,4,4,4,4], //Ceci n'est pas un bullet hell
			 [1,1,1,1,1,1,1,1,1,1]],

			[[0,0,5,5,5,5,5,5,0,0], //Level 5
			 [0,5,4,4,4,4,4,4,5,0], //Encapsulated
			 [0,5,4,4,4,4,4,4,5,0], //Capsule
			 [0,0,5,5,5,5,5,5,0,0]],

			[[3,3,3,3,3,3,3,3,3,3], //Level 6
			 [1,1,1,1,1,1,1,1,1,1], //Stand behind me
			 [1,1,1,1,1,1,1,1,1,1], //Reste derrière moi
			 [5,5,5,5,5,5,5,5,5,5]],

			[[0,6,6,6,6,6,6,6,6,0], //Level 7
			 [6,6,6,6,6,6,6,6,6,6], //Banzai
			 [6,6,6,6,6,6,6,6,6,6]],//Banzai

			[[7,7,7,7,7,7,7,7,7,7,7,7], //Level 8
			 [0,1,1,1,1,1,1,1,1,1,1,0], //Target almost locked
			 [0,0,4,4,4,4,4,4,4,4,0,0], //Cible presque verrouillée
			 [0,0,0,1,1,1,1,1,1,0,0,0]],

			[[8,8,8,8,8,0,8,8,8,8,8], //Level 9
			 [8,0,0,0,0,0,8,0,0,0,0], 
			 [8,0,0,8,8,0,8,0,0,8,8], 
			 [8,0,0,0,8,0,8,0,0,0,8],
			 [8,8,8,8,8,0,8,8,8,8,8]],

			[[2,1,6,3,7,9,8,4,5], //Level 10
			 [2,1,6,3,7,9,8,4,5], //Rainbow
			 [2,1,6,3,7,9,8,4,5], //Arc-en-ciel
			 [2,1,6,3,7,9,8,4,5]],

			[[0,0,1,0,0,0,0,0,1,0,0], //Level 11
			 [0,1,1,0,0,0,0,1,1,0,0], //Eleven
			 [0,0,1,0,0,0,0,0,1,0,0], //Onze
			 [0,0,1,0,0,0,0,0,1,0,0],
			 [1,1,1,1,1,0,1,1,1,1,1]],

			[[2,7,2,7,2,7,2,7], //Level 12
			 [7,2,7,2,7,2,7,2], //Deadly checkers
			 [2,7,2,7,2,7,2,7], //Échiquier fatal
			 [7,2,7,2,7,2,7,2]],

			[[0,0,0,1,0,0,0], //Level 13
			 [0,0,1,1,1,0,0], //To the top with you
			 [0,1,1,1,1,1,0], //Au top
			 [1,1,1,1,1,1,1],
			 [0,0,0,1],
			 [0,0,0,1],
			 [0,0,0,1],
			 [0,0,0,1]],

			[[0,0,0,9], //Level 14
			 [0,0,0,9], //Not based on opinion
			 [0,0,0,9], //Pas basé sur l'opinion
			 [0,0,0,9],
			 [9,9,9,9,9,9,9],
			 [0,9,9,9,9,9,0],
			 [0,0,9,9,9,0,0],
			 [0,0,0,9,0,0,0]],

			[[0,0,6,6,6],     //Level 15
			 [0,6,6,6,6,6],   //Thanks for the gold
			 [6,6,6,0,6,6,6], //Merci pour l'or
			 [6,6,0,10,0,6,6], 
			 [6,6,6,0,6,6,6],
			 [0,6,6,6,6,6],
			 [0,0,6,6,6]],

			[[0,0,0,1,1], //Level 16
			 [0,0,1,1,1,1],
			 [0,1,1,5,5,1,1],
			 [1,1,5,8,8,5,1,1],
			 [1,1,5,8,8,5,1,1],
			 [0,1,1,5,5,1,1],
			 [0,0,1,1,1,1],
			 [0,0,0,1,1]]


			 

			 ];

//Level names
var level_names_en = ["Orange is the new ghost", "Cross the line", "Death from above", "Still not bullet hell", "Encapsulated",
					"Stand behind me", "Banzai", "Target almost locked", "Well Played", "Rainbow",
					"Eleven","Deadly checkers", "To the top with you", "Not based on opinion", "Thanks for the gold",
					"Hard core", 
					];

var level_names_fr = ["Alerte orange", "La ligne rouge", "La mort vient d'en haut", "Ceci n'est pas un bullet hell", "Capsule",
					"Reste derrière moi", "Banzai", "Cible presque verrouillée", "Bien joué", "Arc-en-ciel",
					"Onze","Échiquier fatal", "Au top", "Pas basé sur l'opinion", "Merci pour l'or",
					"Noyau dur", 
					];

//Speed values for each level : Start speed, speedup each time an enemy is killed, acceleration of the speedup
var speed_values = [[20,4,0.25], [20,5,0.25], [20,4,0.25], [20,5,0.5], [10,5,0.5], //5
					[20,4,0.3],  [20,6,0.5],  [20,4,0.4],  [15,5,0.3], [20,4,0.5], //10
					[20,5,0.25], [25,4,0.5],  [20,15,0.5], [20,15,0.5], [15,4,0.4], //15
					[15,4,0.3]
					];

//Bonus levels
var bonus_levels = [[[00,00,01,01,01,01,01,01,00,00],
					 [00,01,10,01,10,01,10,01,10,00],
					 [01,01,01,01,01,01,01,01,01,01],
					 [01,10,01,10,01,10,01,10,01,01]],

					 [[1,7,1,1,7,1,1,7,1,1,7,1],
					  [1,10,1,1,10,1,1,10,1,1,10,1],
					  [1,5,1,1,5,1,1,5,1,1,5,1]]


					 ];

//Special levels for testing
var lineof4s = [[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]];

var fuckyou = [[3,3,3,3,3,2,3,3,3,2,3,3,3,2,2,2,2,3,3,3,3,3,3],
			 [3,3,3,3,3,3,2,3,2,3,3,3,3,2,3,3,3,2,3,3,3,3,3],
			 [3,3,3,3,3,3,3,2,3,3,3,3,3,2,3,3,3,2,3,3,3,3,3],
			 [3,3,3,3,3,3,2,3,2,3,3,3,3,2,3,3,3,2,3,3,3,3,3],
			 [3,3,3,3,3,2,3,3,3,2,3,3,3,2,2,2,2,3,3,3,3,3,3]];

function preload() {
		//Images
		game.load.image('shot', 'assets/shot.png');
		game.load.image('explosion', 'assets/explosion.png');
		game.load.image('clear_wave', 'assets/clear.png');
		game.load.image('shield', 'assets/shield_WIP.png');
		game.load.image('space', 'assets/bg.png');
		game.load.image('extralife', 'assets/powerup_life.png');

		//Spritesheets
		game.load.spritesheet('enemyshots', 'assets/enemyshots.png', 4, 8);
		game.load.spritesheet('enemy', 'assets/enemy.png', 16, 16);
		game.load.spritesheet('bonusship', 'assets/bonus_ship.png', 32, 16);
		game.load.spritesheet('ship', 'assets/ship24.png', 24, 28);
		game.load.spritesheet('powerup_power', 'assets/powerup.png', 16, 16);
		game.load.spritesheet('powerup_cooldown', 'assets/powerup_cooldown.png', 16, 16);
		game.load.spritesheet('powerup_special', 'assets/powerup_special.png', 16, 16);
		game.load.spritesheet('powerup_kill', 'assets/powerup_kill.png', 16, 16);
		game.load.spritesheet('powerup_clear', 'assets/powerup_clear.png', 16, 16);
		game.load.spritesheet('powerup_orange', 'assets/powerup_orange.png', 16, 16);
		game.load.spritesheet('powerup_freeze', 'assets/powerup_freeze.png', 16, 16);
		game.load.spritesheet('powerup_warp', 'assets/powerup_warp.png', 16, 16);
		game.load.spritesheet('powerup_shield', 'assets/powerup_shield.png', 16, 16);
		game.load.spritesheet('bonus_level', 'assets/bonus_level.png', 16, 16);

		//Music
		game.load.audio('ambient', ['assets/audio/e1m1.mp3']);
		game.load.audio('bonus_loop', ['assets/audio/mindlesslittleloop.mp3']);

		//Sounds
		game.load.audio('pickup', ['assets/audio/pickup.wav']);
		game.load.audio('hellyeah', ['assets/audio/hellyeah.mp3']);
		game.load.audio('fire', ['assets/audio/fire.wav']);
		game.load.audio('firespecial', ['assets/audio/firespecial.wav']);
		game.load.audio('enemyfire', ['assets/audio/enemylaser.wav']);
		game.load.audio('explode', ['assets/audio/explode.wav']);
		game.load.audio('wave', ['assets/audio/wave.wav']);
		game.load.audio('hitenemy', ['assets/audio/hitenemy.wav']);  
		game.load.audio('killenemy', ['assets/audio/killenemy.mp3']);  
		game.load.audio('win', ['assets/audio/tunak-tunak-tun.mp3']);
		game.load.audio('over', ['assets/audio/gameover.ogg']); 
		game.load.audio('sax', ['assets/audio/sax.mp3']);

}


function create() {
		
	game.renderer.clearBeforeRender = false;
	game.renderer.roundPixels = true;

	game.physics.startSystem(Phaser.Physics.ARCADE);

	timer_to_next_level = new Phaser.Timer(this, false);

	//Create the background
	background = game.add.tileSprite(0, 0, game.width, game.height, 'space');
	if (difficulty == OHGOD) {
		background.tint = 0xff0000;
	} else {	
		background.tint = 0x3355ee;
	}
	shots = game.add.group();
	shots.enableBody = true;
	special_shots = game.add.group();
	special_shots.enableBody = true;
	enemy_shots = game.add.group();
	enemy_shots.enableBody = true;
	explosions = game.add.group();
	explosions.enableBody = true;
	enemies = game.add.group();
	enemies.enableBody = true;
	bonusships = game.add.group();
	bonusships.enableBody = true;
	items = game.add.group();

	shield = game.add.sprite(0, 0, 'shield');

	//Create the player's ship
	createPlayer();
	game.camera.follow(player);
	
	//All inputs
	cursors = game.input.keyboard.createCursorKeys();
	fire_btn = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	special_btn = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	mute_btn = game.input.keyboard.addKey(Phaser.Keyboard.M);
	pause_btn = game.input.keyboard.addKey(Phaser.Keyboard.P);
	restart_btn = game.input.keyboard.addKey(Phaser.Keyboard.R);

	//mute_btn.onUp.add(muteGame, this);
	pause_btn.onDown.add(pauseGame, this);

	//Ingame Text
	text_middle = game.add.text(200, game.world.height/2, '', {font: '32px Minecraftia', fill: '#ffffff'});
	text_middle.fixedToCamera = true;
	text_pause = game.add.text(200, game.world.height/1.5, 'PAUSE', {font: '32px Minecraftia', fill: '#ffffff'});
	text_pause.fixedToCamera = true;
	text_pause.alpha = 0;
	text_score = game.add.text(16, 5, '', {font: '16px Minecraftia', fill: '#00aaff'});
	text_score.fixedToCamera = true;
	text_level = game.add.text(200, game.world.height/2 + 40, '', {font: '16px Minecraftia', fill: '#00aaff'});
	text_level.fixedToCamera = true;

	music = game.add.audio('ambient');
	music.loop = true;
	music_bonus = game.add.audio('bonus_loop');
	music_bonus.loop = true;
	if (!mute) {
		music.play();
	}

	//Create all sounds
	pickup_sd = game.add.audio('pickup');
	hellyeah_sd = game.add.audio('hellyeah');
	playerhit_sd = game.add.audio('explode');
	hitenemy_sd = game.add.audio('hitenemy');
	killenemy_sd = game.add.audio('killenemy');
	fire_sd = game.add.audio('fire');
	firespecial_sd = game.add.audio('firespecial');
	enemyfire_sd = game.add.audio('enemyfire');
	wave_sd = game.add.audio('wave');
	intro_sd = game.add.audio('intro');
	win_sd = game.add.audio('win');
	over_sd = game.add.audio('over');

	text_ship = game.add.text(player.body.x - 20, player.body.y-20, '', {font: '16px Minecraftia', fill: '#44ff44'});
	text_ship.anchor.setTo(0.5, 0.5);
	text_ship.alpha = 0;

	speed = START_SPEED;
	speedup = SPEEDUP_INIT;
	accel = SPEEDUP_ACCEL;
	loadLevel(0);
	enemies.setAll('body.velocity.x', speed);

}


function update() {
	//Check collisions for everything
	game.physics.arcade.collide(shots, enemies, hitEnemy, null, this);
	game.physics.arcade.collide(special_shots, enemies, hitEnemy, false, this); 
	game.physics.arcade.collide(explosions, enemies, hitEnemy, null, this);
	game.physics.arcade.collide(shots, bonusships, hitBonusShip, null, this);
	//game.physics.arcade.collide(player, enemies, levelFailed, null, this);
	game.physics.arcade.collide(player, enemies, playerHit, function(){return (!lostAlife && shield_time == 0);}, this);
	game.physics.arcade.collide(player, enemy_shots, playerHit, null, this);
	game.physics.arcade.collide(player, items, collectItem, null, this);



	text_score.text = 'Niveau ' + (current_level+1) + '    Score: ' + score + '   Vies: ' + lives
									+ '\nPuissance: ' + power + ' Vitesse de tir: '+ cooldown_reduction +'    Tir spécial: '+special_available;
	//background.tilePosition.y += current_level/5 + 1;
	background.tilePosition.y += 1 + (14*in_bonus_level); //FIXME

	//All controls are disabled when the player dies
	if (!lostAlife) {
		//Mute button
		if (mute_btn.isDown) {
			if (mute_wait == 0) {
				muteGame();
			}
		};

		//Control the player
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;
			//if (!player.touched) {
					//player.body.velocity.y = 0; 
			//};
		if (cursors.up.isDown && difficulty < OHGOD) {
			player.body.velocity.y = -PLAYER_SPEED;
			player.body.velocity.x = 0; 
			//player.animations.play('left');
		} else if (cursors.down.isDown  && difficulty < OHGOD) {
			player.body.velocity.y = PLAYER_SPEED;
			player.body.velocity.x = 0; 
			//player.animations.play('right');
		}

		if (cursors.left.isDown) {
			player.body.velocity.x = -PLAYER_SPEED;
			//player.body.velocity.y = 0; 
			player.animations.play('left');
		} else if (cursors.right.isDown) {
			player.body.velocity.x = PLAYER_SPEED;
			//player.body.velocity.y = 0; 
			player.animations.play('right');
		} else if (!lostAlife) {
				player.animations.play('idle');
		}

		 //Fire shots
		if (fire_btn.isDown) {
			if (shots_cooldown == 0) {
				switch (power) { //Number of shots depends on the ship's power
					case 7:
						createShot(player.body.center.x-17, player.body.y, -30, -270);
						createShot(player.body.center.x+13, player.body.y, 30, -270);
					case 5:
						createShot(player.body.center.x-12, player.body.y, -20, -280);
						createShot(player.body.center.x+8, player.body.y, 20, -280);
					case 3:
						createShot(player.body.center.x-7, player.body.y, -10, -290);
						createShot(player.body.center.x+3, player.body.y, 10, -290);                        
					case 1:
					default:
						createShot(player.body.center.x-2, player.body.y, 0, -300);
						//createShot(player.body.center.x-2, player.body.y, Math.random()*60-30, -300); //Another weapon ?
						break;
					case 6:
						createShot(player.body.center.x-16, player.body.y, -16, -280);
						createShot(player.body.center.x+12, player.body.y, 16, -280);                        
					case 4:
						createShot(player.body.center.x-11, player.body.y, -8, -290);
						createShot(player.body.center.x+7, player.body.y, 8, -290);
					case 2:
						createShot(player.body.center.x-6, player.body.y, 0, -300);
						createShot(player.body.center.x+2, player.body.y, 0, -300);
						break;
				}
				shots_cooldown = (DEFAULT_FIRE_COOLDOWN + 10*power) * (1-cooldown_reduction/(MAX_CDR*2.0));
			}
		}

		//Fire super special shots 
		if (special_btn.isDown) {
			if (special_available > 0 && special_cooldown == 0) {
				if (power == MAX_POWER) {
					createSpecialShot(player.body.center.x-2, player.body.y, -10, -300);
					createSpecialShot(player.body.center.x-2, player.body.y, 10, -300)
				} else {
					createSpecialShot(player.body.center.x-2, player.body.y, 0, -300);
				}
				special_available--;
			}
		}		

		if (shield_time > 0) {
			shield_time--;
		} else {
			shield_time = 0;
		}
		shield.alpha = Math.min(shield_time/60.0, 0.75); //Fade the shield sprite with time


		if (shots_cooldown > 0) {
			shots_cooldown--;
		} else {
			shots_cooldown = 0;
		}

		if (special_cooldown > 0) {
				special_cooldown--;
		} else {
				special_cooldown = 0;
		}


	} else {
	//When the player dies
			player.body.velocity.x = 0;
			player.animations.play('dead');
			//enemies.setAll('body.velocity.x', 0);
			if (lives == 0) {
				if (restart_btn.isDown) {
					restart(0);
				}
			}
	};

	if (mute_wait > 0) {
			mute_wait--;
	} else {
			mute_wait = 0;
	}

	//Move the enemies
	enemies.forEachAlive(function(enemy){
		enemy.animations.play('move');
		if (left) {
			enemies.setAll('body.velocity.x', -speed);   
		} else {
			enemies.setAll('body.velocity.x', speed);               
		}
		if (enemy.body.position.x < 10) {
			left = false;
			enemies.addAll('body.position.x', 10);        
			enemies.addAll('body.position.y', enemy.body.height);      
		} else if (enemy.body.position.x >= game.world.width - 25) {
			left = true;
			enemies.addAll('body.position.x', -10);
			enemies.addAll('body.position.y', enemy.body.height);
		}
		if (enemy.position.y > game.world.height) {
			levelFailed();
		}

		//Make the enemies fire
		random = Math.random();
		if (random < enemy.fireProba) {
			switch (enemy.type) {
				default:
				case 1:
					enemyFire(enemy, 0, 100);
					break;
				case 2:
					enemyFire(enemy, -25, 100);
					enemyFire(enemy, 0, 100);
					enemyFire(enemy, 25, 100);
					break;
				case 3:
					enemyFire(enemy, 0, 300);
					break; 
				case 7:
					enemyFire(enemy, 0, 1);
					break;
				case 9:
					enemyFire(enemy, Math.random()*200-100, Math.random()*200+50);
					break;
				case 11: //OH GOD
					enemyFire(enemy, 0, 600);
					break; 
			}
		}
	});
	
	//When the level is beaten
	if (enemies.countLiving() == 0 && enemy_shots.countLiving() == 0 && current_level < levels.length) {
		bonusships.forEachAlive(function(bship) {
			if (bship.body.velocity.x == 0) {
				bship.kill();
				console.log("bonus ship en attente killé"); //FIXME
			}
		});
		console.log('level ' + (current_level+1) + ' beaten');
		shots.removeAll();
		
		//timer.start();
		//console.log(timer.seconds);
		if (in_bonus_level) {
			current_bonus_level++;
			in_bonus_level = false;
			music_bonus.stop();
			music.play();
		}
		loadLevel(++current_level);

	}

	//Kill shots and items when touching bounds
	shots.forEachAlive(function(proj) {
		if (proj.body.y < -10 || proj.body.x < -4 || proj.body.x > game.world.width + 4) {
				proj.kill();
		}
	});

	enemy_shots.forEachAlive(function(proj) {
		if (proj.body.y > game.world.height+8 || proj.body.x < -4 || proj.body.x > game.world.width + 4) {
				proj.kill();
		}
	});

	explosions.forEachAlive(function(expl) {
		//game.debug.body(expl);
		if (expl.alpha < 0.1) {
			expl.kill();
		}
	});

	bonusships.forEachAlive(function(bship) {
		if (bship.x > game.world.height + bship.body.width*2 || bship.x < -bship.body.width*2) {
				bship.kill();
		}
	});

}

function collectItem(player, item) {
	if (!lostAlife) {         
		switch (item.key) {
			case 'powerup_power': //Raises the player's firepower
				if (power < MAX_POWER) {
					power++;
				}			
				if (power == MAX_POWER) {
					text_ship.text = "PUISSANCE MAX!";
				} else {
					text_ship.text = "Puissance +!";
				}
				score += 300;
			break;
			case 'powerup_cooldown': //Raises the player's rate of fire
				if (cooldown_reduction < MAX_CDR) {
					cooldown_reduction += 3;
				}
				if (cooldown_reduction >= MAX_CDR) {
					cooldown_reduction = MAX_CDR;
					text_ship.text = "VITESSE MAX!";
				} else {
					text_ship.text = "Vitesse tir +!";
				}
				score += 300;
			break;            
			case 'powerup_special': //Gives a special shot charge
				special_available++;
				score += 500;
				text_ship.text = "Tir special +1!";
			break;

			case 'powerup_shield': //Gives a temporary shield
				player.addChild(shield);
				shield.anchor.setTo(0.5, 0.5);
				shield.smoothed = false;
				shield_time += 300;
				if (!mute) {
					//shield.play();
				}
				score += 500;
				text_ship.text = "Bouclier !";
			break;

			case 'powerup_kill': //Tries to shoot all the enemies at once
				enemies.forEachAlive(function(enemy) {
					createShot(player.body.center.x, player.body.center.y,  (enemy.x-player.x+enemy.body.velocity.x)*2, (enemy.y-player.y)*2);
				});
				score += 750;
				text_ship.text = "KILL 'EM ALL !";
			break;

			case 'powerup_clear': //Clears the screen of enemy fire
				var wave = game.add.sprite(player.body.center.x, player.body.center.y, 'clear_wave');
				wave.anchor.setTo(0.5, 0.5);
				wave.smoothed = false;
				game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
				game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
				if (!mute) {
					wave_sd.play();
				}
				enemy_shots.removeAll();
				score += 300;
				text_ship.text = "Neutralisation !";
			break;

			case 'powerup_orange': //Turn all enemies to default, orange ones
				var wave = game.add.sprite(player.body.center.x, player.body.center.y, 'clear_wave');
				wave.tint = 0xff7f00;
				wave.anchor.setTo(0.5, 0.5);
				wave.smoothed = false;
				game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
				game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
				if (!mute) {
					wave_sd.play();
				}
				enemies.forEachAlive(function(e){ //Orangify all the enemies
					e.type = 1;
					e.animations.add('move', [0, 1], 6, true);
					e.health = 1;
					e.fireProba = ENEMY_DEFAULT_FIRE_PROBA;
					e.value = 100
				});
				score += 500;
				text_ship.text = "Tous oranges !";
			break;

			case 'powerup_freeze': //Stops the enemies on a dime
				var wave = game.add.sprite(player.body.center.x, player.body.center.y, 'clear_wave');
				wave.tint = 0x007fff;
				wave.anchor.setTo(0.5, 0.5);
				wave.smoothed = false;
				game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
				game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
				if (!mute) {
					wave_sd.play();
				}
				speed = 0;
				score += 400;
				text_ship.text = "Stop !";
			break;

			case 'powerup_warp': //TODO : Warps the enemies back to the top of the screen
				enemies.forEachAlive(function(e) {
					//game.add.tween(e).to( {y: e.x - 300}, 1000, Phaser.Easing.Quadratic.Out, true);
				});
				score += 400;
				text_ship.text = "Retour en haut !";
			break;

			case 'extralife': //Gives an extra life
				lives++;
				score += 900;
				text_ship.text = "+1 vie !";
			break;

			case 'bonus_level': //Skips current level and warps the player to a bonus level
				enemies.removeAll();
				enemy_shots.removeAll();
				shots.removeAll();
				if(!in_bonus_level) {
					loadBonusLevel(current_bonus_level);
				} else {
					loadBonusLevel(++current_bonus_level);
				}
				score += 3000;
				text_ship.text = "";
			break;
		}
		text_ship.alpha = 1;
		text_ship.x = player.body.x;
		text_ship.y = player.body.y - 10;
		var tween_bonus = game.add.tween(text_ship).to( { alpha: 0, y: player.body.y-40 }, 1000, Phaser.Easing.Linear.None, true);

		console.log(item.key + ' collected');

		if (!mute) {
			pickup_sd.play();
		}
		item.kill();
	};
}

//When the player is hit by enemy fire
function playerHit(player, shot) {
	shot.kill();
	if (!lostAlife && !player.touched && !shield_time) {   
		playerhit_sd.play();
		lostAlife = true;
		player.touched = true;
		player.body.collideWorldBounds = false;
		player.body.velocity.y = 125;
		createExplosion(player.body.center.x, player.body.center.y);
		//var tween_death = game.add.tween(player.body).to( { y: game.world.height+10 }, 1000, Phaser.Easing.Linear.None, true);
		
		if (!in_bonus_level) {
			if (difficulty == EASY) {
				if (power > 2) {
					power /= 2;
					power = Math.ceil(power);
				}
			} else {
				if (power > 1) {
					power /= 2;
					power = Math.floor(power);
				}
			}
			if (cooldown_reduction > 0) {
				cooldown_reduction /= 2;
				cooldown_reduction = Math.floor(cooldown_reduction);
			}
			special_available = 1;
			lives--;
			if (lives > 0) {
				setTimeout(function(){
					player.body.collideWorldBounds = true;
					//player.y = 550;
					game.add.tween(player.body).to( { y: 550 }, 500, Phaser.Easing.Quadratic.In, true);
					game.add.tween(player.body).to( { x: 300 }, 500, Phaser.Easing.Quadratic.In, true);
					lostAlife = false;
					player.alpha = 0.5;
					shield_time = 180;
					player.addChild(shield);
					shield.anchor.setTo(0.5, 0.5);
					shield.smoothed = false;
				}, 1500);
				window.setTimeout(function(){
					player.touched = false;
					player.alpha = 1;
				}, 3000);
			} else { //GAME OVER
				text_middle.alpha = 1;
				text_middle.text = 'GAME OVER';
				text_level.alpha = 1;
				text_level.text = 'Presser R pour recommencer';
			}
		} else {
			//If you die in a bonus level, no penalty
			window.setTimeout(function(){
				player.body.collideWorldBounds = true;
				//player.y = 550;
				game.add.tween(player.body).to( { y: 550 }, 500, Phaser.Easing.Quadratic.In, true);
				game.add.tween(player.body).to( { x: 300 }, 500, Phaser.Easing.Quadratic.In, true);
				lostAlife = false;
				player.alpha = 0.5;
				enemies.removeAll();
				enemy_shots.removeAll();
				shots.removeAll();
			}, 1500);
			window.setTimeout(function(){
				player.touched = false;
				player.alpha = 1;
			}, 3000);
		}


	}
}

//When the enemies go too low, the level is failed
function levelFailed() {
	if (!lostAlife) {   
		playerhit_sd.play();
		lostAlife = true;
		player.touched = true;
		player.body.collideWorldBounds = false;
		player.body.velocity.y = 125;
		createExplosion(player.body.center.x, player.body.center.y);
		//var tween_death = game.add.tween(player.body).to( { y: game.world.height+10 }, 1000, Phaser.Easing.Linear.None, true);

		lives--;
		if (difficulty == EASY) {
			if (power > 2) {
				power /= 2;
				power = Math.ceil(power);
			}
		} else {
			if (power > 1) {
				power /= 2;
				power = Math.floor(power);
			}
		}
		if (cooldown_reduction > 0) {
			cooldown_reduction /= 2;
			cooldown_reduction = Math.floor(cooldown_reduction);
		}
		special_available = 1;
		current_level--;

		if (lives > 0) {
			window.setTimeout(function(){
				player.body.collideWorldBounds = true;
				//player.body.velocity.y = -100;
				//player.body.position.y = 300; 
				enemies.removeAll();
				lostAlife = false;
				player.alpha = 0.5;
			}, 3000);
			window.setTimeout(function(){
				player.touched = false;
				player.alpha = 1;
				shield_time = 240;
			}, 4000);
		} else { //GAME OVER
			text_middle.alpha = 1;
			text_middle.text = 'GAME OVER';
		}
	}
}

//When a player-fired shot hits an enemy
function hitEnemy(shot, enemy) {
	if (shot.key != 'explosion')  {
		shot.kill();
	}
	if (!enemy.touched) {
		if (enemy.health == 1) {
			enemy.touched = true;
			enemy.animations.stop();
			enemy.body.enable = false;
			score += enemy.value;
			if (!mute) {
					killenemy_sd.play();
			}
			enemy.kill();
			speed += speedup;
			speedup += accel;
			if (enemy.type == 6) { //If the enemy is type 6 (yellow), kamikaze attack !
				enemyFire(enemy, -80, 250);
				enemyFire(enemy, -40, 250);
				enemyFire(enemy, 0, 250);
				enemyFire(enemy, 40, 250);
				enemyFire(enemy, 80, 250);
			} else if (enemy.type == 10) {
				createExplosion(enemy.body.center.x, enemy.body.center.y);
			}

			//randomly create a bonus
			random = Math.random();
			if (random <= POWERUP_CHANCE) {
				//Bonus roulette
				roulette = Math.random()*100;
				if (roulette <= 20) {
					createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_power');
				}
				if (roulette > 20 && roulette <= 40) {
					createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_cooldown');
				}
				if (roulette > 40 && roulette <= 60) {
					createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_special');
				}
				if (roulette > 60 && roulette <= 75) {
					createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_clear');
				}
				if (roulette > 75 && roulette <= 85) {
					createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_shield');
				}
				if (roulette > 85 && roulette <= 90) {
					createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_freeze');
				}
				if (roulette > 90 && roulette <= 95) {
					createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_kill');
				}
				if (roulette > 95 && roulette <= 100) {
					createItem(enemy.body.center.x, enemy.body.center.y, 'extralife');
				}
			}

			//*/
		} else {
			enemy.health--;
			if (!mute) {
				hitenemy_sd.play();
			}
		}
	}
}

//Create the player object
function createPlayer(){
	player = game.add.sprite(300, 550, 'ship');
	game.physics.arcade.enable(player);

	player.body.collideWorldBounds = true;
	player.body.immovable = false;
	lostAlife = false;
	touched = false;

	player.anchor.setTo(0.5,0.5);

	player.animations.add('idle', [0,1], 6, true);
	player.animations.add('left', [2,3], 6, true);
	player.animations.add('right', [4,5], 6, true);
	player.animations.add('dead', [6], 6, true);
}

//Load the enemies and speed values of a level
function loadLevel(lvl) {

	if(lvl >= levels.length) {
		win_sd.play();
		game.add.tween(text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
		game.add.tween(text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);

		text_middle.text = "Niveaux tous finis !\n(pour l'instant)";
		text_level.text = "Merci d'avoir essayé !" ;
	} else {
		text_middle.text = "Niveau " + (lvl+1);
		text_level.text = level_names_fr[lvl];
		//text_level.text = level_names_en[lvl];
		text_middle.alpha = 0;
		text_level.alpha = 0;

		game.add.tween(text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
		game.add.tween(text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);


		if(speed_values[lvl]) {
			speed = speed_values[lvl][0]*(1+difficulty*0.15);
			speedup = speed_values[lvl][1]*(1+difficulty*0.15);
			accel = speed_values[lvl][2]/**(1+difficulty*0.2)*/;
		} else {
			speed = START_SPEED;
			speedup = SPEEDUP_INIT;
			accel = SPEEDUP_ACCEL;
		}
		/*timer = new Phaser.Timer(game, false);
		timer.add(Phaser.Timer.SECOND*2, createEnemies(levels[lvl]), this);
		timer.start(2000);
		*/
		window.setTimeout(function(){
			game.add.tween(text_middle).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
			game.add.tween(text_level) .to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
			//createEnemies(levels[lvl]);   
		}, 3000);
		//Set a delay for the bonus ship to come (20 to 40 secs)
		createEnemies(levels[lvl]); 
		var delayForBonus = Math.random()*20*1000 + 20000;
		bonusShip(delayForBonus);
	}
}

//BONUS LEVEL
//ENORME TODO
function loadBonusLevel(lvl) {
	music.stop();
	if(!mute && !in_bonus_level) {
		music_bonus.play();	
	}
	in_bonus_level = true;

	text_middle.text = "Niveau bonus !";
	text_level.text = "YAY ! (il est en travaux btw)";
	//text_level.text = level_names_en[lvl];
	text_middle.alpha = 0;
	text_level.alpha = 0;

	game.add.tween(text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
	game.add.tween(text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);


	speed = START_SPEED;
	speedup = SPEEDUP_INIT;
	accel = SPEEDUP_ACCEL;
	/*timer = new Phaser.Timer(game, false);
	timer.add(Phaser.Timer.SECOND*2, createEnemies(levels[lvl]), this);
	timer.start(2000);
	*/
	window.setTimeout(function(){
		game.add.tween(text_middle).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
		game.add.tween(text_level) .to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
		//createEnemies(levels[lvl]);   
	}, 3000);
	createEnemies(bonus_levels[lvl]);
}

//Create an array of enemies at the default location
function createEnemies(array){
	createEnemiesAbs(array, 10, 30);
}

//Create an array of enemies at the given location
function createEnemiesAbs(array, x, y) {
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array[i].length; j++) {
			if (array[i][j] > 0) {
				var enemy = game.add.sprite(x+j*25, y+i*25, 'enemy');
				game.physics.arcade.enable(enemy);
				enemy.anchor.setTo(0.5);
				enemy.body.immovable = true;
				enemy.type = array[i][j];	
				if (difficulty == OHGOD) {
					if (array[i][j] == 1) {
						enemy.type = 3;
					} else if (array[i][j] == 3) {
						enemy.type = 11;
					}
				}
				enemy.animations.add('move', [2*(enemy.type-1), 2*(enemy.type-1)+1], 6, true);
				enemy.fireProba = ENEMY_DEFAULT_FIRE_PROBA;
				enemy.health = 1;
				switch (enemy.type) {
					default:
					case 1: //ORANGE : normal
						enemy.value = 100;
						break;
					case 2: //RED : fires multiple shots
						enemy.fireProba = ENEMY_DEFAULT_FIRE_PROBA*0.8;
						enemy.value = 200
						break;
					case 3: //GREEN : fires fast shots
						enemy.value = 200
						break;
					case 4: //PURPLE : fires twice as often
						enemy.fireProba = ENEMY_DEFAULT_FIRE_PROBA*2;
						enemy.value = 150
						break;
					case 5: //GRAY : takes 2 hits
						enemy.health = 2;
						enemy.value = 250
						break;
					case 6: //YELLOW : Fires 5 shots when killed
						enemy.fireProba = ENEMY_DEFAULT_FIRE_PROBA*0.5;
						enemy.value = 100
						break;
					case 7: //CYAN : fires gravity-affected shots
						enemy.fireProba = ENEMY_DEFAULT_FIRE_PROBA*1.2;
						enemy.value = 200
						break;
					case 8: //PINK : takes 3 hits, fires more often
						enemy.health = 3;
						enemy.fireProba = ENEMY_DEFAULT_FIRE_PROBA*1.5;
						enemy.value = 400
						break;
					case 9: //BLUE : fires in random directions
						enemy.fireProba = ENEMY_DEFAULT_FIRE_PROBA*1.5;
						enemy.value = 150;
						break;
					case 10: //BROWN : explodes when killed
						enemy.fireProba = ENEMY_DEFAULT_FIRE_PROBA*0.75;
						enemy.value = 100;
						break;
					case 11: //DARK GREEN : Fires REALLY FAST shots
						enemy.value = 400;
						break;
				}
				enemies.add(enemy);
			}
		};
	};

}

//When a bonus appears
function createItem(x, y, key) {
	var item = game.add.sprite(x, y, key);
	game.physics.arcade.enable(item);
	switch (key) {
		case 'powerup_power':
		case 'powerup_cooldown':
		case 'powerup_special':
		case 'powerup_kill':
		case 'powerup_clear':
		case 'powerup_orange':
		case 'powerup_freeze':
		case 'powerup_shield':
		case 'powerup_warp':
				item.animations.add('idle', [0,1,2,3], 18, true);
				break;
		case 'bonus_level':
				item.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 18, true);
				break;
		case 'extralife':
				break;
	}
	item.animations.play('idle');
	item.body.gravity.y = 100;
	items.add(item);
}

function createShot(x, y, velx, vely) {
	var shot = game.add.sprite(x, y, 'shot');
	game.physics.arcade.enable(shot);
	shot.body.velocity.x = velx;
	shot.body.velocity.y = vely;
	if (!mute) {
			fire_sd.play();
	}
	//shots_cooldown = DEFAULT_FIRE_COOLDOWN - cooldown_reduction + 10*power;
	
	shots.add(shot);
}

function createSpecialShot(x, y, velx, vely) { //V2.0
	for (var i=0; i < 9+power; i++) {
		createShot(x, y, velx, vely-i*20);
	}
	if (!mute) {
		firespecial_sd.play();
	}
	special_cooldown = DEFAULT_FIRE_COOLDOWN;
	//special_available--;
}

function createExplosion(x, y) {
	var expl = game.add.sprite(x, y, 'explosion');
	game.physics.arcade.enable(expl);
	expl.anchor.setTo(0.5);
	expl.smoothed = false;
	expl.body.immovable = true;
	if (!mute) {
			playerhit_sd.play();
	}
	explosions.add(expl);
	enemies.forEachAlive( function(e) {
	if (game.physics.arcade.distanceBetween(expl, e) < 40) {
		hitEnemy(expl, e);
	}
	});
	game.add.tween(expl).to( { alpha: 0}, 2000, Phaser.Easing.Quintic.Out, true);
	game.add.tween(expl.scale).to( {x: 2, y: 2 }, 1500, Phaser.Easing.Quintic.Out, true);
	//var tween_expl2 = game.add.tween(expl.body.size).to( {x: 10, y: 10 }, 5000, Phaser.Easing.Quintic.Out, true);

}

function enemyFire(enemy, velx, vely) {
	var enemyshot = game.add.sprite(enemy.body.center.x, enemy.body.center.y, 'enemyshots', enemy.type-1);
	game.physics.arcade.enable(enemyshot);
	enemyshot.body.velocity.x = velx;
	enemyshot.body.velocity.y = vely;
	enemyshot.body.mass = 0;
	enemyshot.type = enemy.type;
	if (!mute) {
		enemyfire_sd.play();
	}
	if (enemy.type == 7) {
		enemyshot.body.gravity.y = 250;
		if (enemy.body.x <= player.body.x) {
			enemyshot.body.gravity.x = 10-(enemy.body.x - player.body.x)/10;
		} else {
			enemyshot.body.gravity.x = -10-(enemy.body.x - player.body.x)/10;
		}
	}
	enemy_shots.add(enemyshot);
}

function bonusShip(delay) {
	window.setTimeout(function(){
		var bship = game.add.sprite(-32, 15, 'bonusship', 0);

		bship.animations.add('move', [0,1,2,3], 12, true);
		game.physics.arcade.enable(bship);
		if (Math.random() < 0.5) {
			bship.body.velocity.x = 90; 
		} else {
			bship.x = game.world.width + 10;
			bship.body.velocity.x = -90;
		}				   
		bonusships.add(bship); 
		bship.animations.play('move');
		bship.value = 1000;   
	}, delay);
}

function hitBonusShip(shot, bship) {
	shot.kill();
	if (!bship.touched) {
		bship.touched = true;
		bship.animations.stop();
		bship.body.enable = false;
		score += bship.value;
		if (!mute) {
			killenemy_sd.play();
		}
		bship.kill();

		//randomly create a bonus
		random = Math.random() * 100;
		if (random <= 10) {
			createItem(bship.body.center.x, bship.body.center.y, 'extralife');
		}
		if (random > 10 && random <= 25) {
			createItem(bship.body.center.x, bship.body.center.y, 'powerup_power');
		}
		if (random > 25 && random <= 40) {
			createItem(bship.body.center.x, bship.body.center.y, 'powerup_cooldown');
		}
		if (random > 40 && random <= 55) {
			createItem(bship.body.center.x, bship.body.center.y, 'powerup_special');
		}				
		if (random > 55 && random <= 70) {
			createItem(bship.body.center.x, bship.body.center.y, 'powerup_freeze');
		}
		if (random > 70 && random <= 80) {
			createItem(bship.body.center.x, bship.body.center.y, 'powerup_kill');
		}				
		if (random > 80 && random <= 90) {
			createItem(bship.body.center.x, bship.body.center.y, 'powerup_orange');
		}				
		if (random > 90 && random <= 100) {
			createItem(bship.body.center.x, bship.body.center.y, 'bonus_level');
		}
	}
}

function muteGame() {
	if (!mute) {
		mute = true;
		music.pause()
		music_bonus.pause();
	} else {
		mute = false;
		if (in_bonus_level) {
			music_bonus.resume();
		} else {
			music.resume();
		}
	}

	console.log('mute is ' + mute);
	mute_wait = 30;
}

function pauseGame() {
	if (lives > 0) {
		if (!game.paused) {
			text_pause.alpha = 1;
			game.paused = true;
			music.pause();
		} else {
			text_pause.alpha = 0;
			game.paused = false;
			if (!mute) {
				music.resume();
			}
		}
		console.log('game is paused : ' + game.paused);
	}
}

function only(n) {
	return [[0,0,n,n,n,n,n,n,0,0],
			[0,n,n,n,n,n,n,n,n,0],
			[n,n,n,n,n,n,n,n,n,n],
			[n,n,n,n,n,n,n,n,n,n]];

}

function restart(level) {
	score = 0;
	lives = 3;
	power = (difficulty == -1 ? 2 : 1);
	shield_time = 0;
	shots_cooldown = 0;
	special_cooldown = 0;
	special_available = 1;
	cooldown_reduction = 0;
	items.removeAll();
	shots.removeAll();
	special_shots.removeAll();
	bonusships.removeAll();
	enemies.removeAll();
	enemy_shots.removeAll();
	player.kill();
	createPlayer();
	current_level = level-1;
	current_bonus_level = 0;
}
