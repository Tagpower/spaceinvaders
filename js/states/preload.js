//Constants
var EASY = -1;
var NORMAL = 0;
var HARD = 1;
var OHGOD = 2;
var difficulty = 0;
var currentDifficulty = 0;

var START_SPEED = 20;
var SPEEDUP_INIT = 5;
var SPEEDUP_ACCEL = 0.5;
var PLAYER_SPEED = 150;
var DEFAULTS = [START_SPEED, SPEEDUP_INIT, SPEEDUP_ACCEL];
var DEFAULT_FIRE_COOLDOWN = 40;
var ENEMY_DEFAULT_FIRE_PROBA = 0.004 + difficulty*0.0015;
var POWERUP_CHANCE = 0.05 - difficulty*0.01;
var POWERUP_CHANCE_IN_BONUS = 2*POWERUP_CHANCE;
var MAX_POWER = (difficulty < OHGOD ? 7 : 5);
var MAX_CDR = 50;



// State
var preload = function(game) {
   console.log("Preloading...");
}

preload.prototype = {
   preload: function() {
      //Images
		this.game.load.image('shot', 'assets/shot.png');
		this.game.load.image('explosion', 'assets/explosion.png');
		this.game.load.image('clear_wave', 'assets/clear.png');
		this.game.load.image('shield', 'assets/shield_WIP.png');
		this.game.load.image('space', 'assets/bg.png');
		this.game.load.image('extralife', 'assets/powerup_life.png');

		//Spritesheets
		this.game.load.spritesheet('enemyshots', 'assets/enemyshots.png', 4, 8);
		this.game.load.spritesheet('enemy', 'assets/enemy.png', 16, 16);
		this.game.load.spritesheet('bonusship', 'assets/bonus_ship.png', 32, 16);
		this.game.load.spritesheet('ship', 'assets/ship24.png', 24, 28);
		this.game.load.spritesheet('powerup_power', 'assets/powerup.png', 16, 16);
		this.game.load.spritesheet('powerup_cooldown', 'assets/powerup_cooldown.png', 16, 16);
		this.game.load.spritesheet('powerup_special', 'assets/powerup_special.png', 16, 16);
		this.game.load.spritesheet('powerup_kill', 'assets/powerup_kill.png', 16, 16);
		this.game.load.spritesheet('powerup_clear', 'assets/powerup_clear.png', 16, 16);
		this.game.load.spritesheet('powerup_orange', 'assets/powerup_orange.png', 16, 16);
		this.game.load.spritesheet('powerup_freeze', 'assets/powerup_freeze.png', 16, 16);
		this.game.load.spritesheet('powerup_warp', 'assets/powerup_warp.png', 16, 16);
		this.game.load.spritesheet('powerup_shield', 'assets/powerup_shield.png', 16, 16);
		this.game.load.spritesheet('bonus_level', 'assets/bonus_level.png', 16, 16);
		this.game.load.spritesheet('menu_buttons', 'assets/menu_buttons.png', 96, 32);

		//Music
		this.game.load.audio('ambient', ['assets/audio/e1m1.mp3']);
		this.game.load.audio('ambient_ohgod', ['assets/audio/no_remorse.mp3']); //Provisoire
		this.game.load.audio('title', ['assets/audio/invaders.mp3']);
		this.game.load.audio('bonus_loop', ['assets/audio/mindlesslittleloop.mp3']);

		//Sounds
		this.game.load.audio('pickup', ['assets/audio/pickup.wav']);
		this.game.load.audio('hellyeah', ['assets/audio/hellyeah.mp3']);
		this.game.load.audio('fire', ['assets/audio/fire.wav']);
		this.game.load.audio('firespecial', ['assets/audio/firespecial.wav']);
		this.game.load.audio('enemyfire', ['assets/audio/enemylaser.wav']);
		this.game.load.audio('explode', ['assets/audio/explode.wav']);
		this.game.load.audio('wave', ['assets/audio/wave.wav']);
		this.game.load.audio('hitenemy', ['assets/audio/hitenemy.wav']);  
		this.game.load.audio('killenemy', ['assets/audio/killenemy.mp3']);  
		this.game.load.audio('win', ['assets/audio/tunak-tunak-tun.mp3']);
		this.game.load.audio('over', ['assets/audio/gameover.ogg']); 
		this.game.load.audio('sax', ['assets/audio/sax.mp3']);

		var loadingBar = this.game.add.sprite(game.world.centerX, 400, "loading");
		//loadingBar.anchor.setTo(0.5);
		this.load.setPreloadSprite(loadingBar, 0);
   },
   create: function() {
      console.log("-*- Preloaded -*-");
      this.game.state.start("GameTitle");
   }
}
