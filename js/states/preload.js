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
var COIN_CHANCE = 0.25;
var COIN_CHANCE_IN_BONUS = 0.75;
var COINS_FOR_POWERUP = 50 + difficulty*25
var POWERUP_CHANCE = 0.05 - difficulty*0.01;
var POWERUP_CHANCE_IN_BONUS = 2*POWERUP_CHANCE;
var MAX_POWER = (difficulty < OHGOD ? 7 : 5);
var MAX_CDR = 50;



// State
var preload = function(game) {
   console.log("Preloading...");
   Phaser.State.call(this);
}

preload.prototype = Object.create(Phaser.State);
preload.prototype.constructor = preload;

preload.prototype = {
   preload: function() {

      var loadingBar = this.game.add.sprite(game.world.centerX, 400, "loading");
      this.load.setPreloadSprite(loadingBar, 0);

      var text_loading = self.game.add.text(self.game.world.centerX, 350, '', {font: '16px Minecraftia', fill: '#ffffff', align: 'center'});
      text_loading.smoothed = false;
      text_loading.anchor.setTo(0.5);

      var loading_strings = ["Recrutement de fantômes",
                             "Finissage des sprites",
                             "C'est les musiques qui mettent longtemps",
                             "Deux secondes",
                             "Auto-réparation du code",
                             "Nettoyage du vaisseau",
                             "Suppression de commentaires grossiers",
                             "Un p'tit verre en attendant ?",
                             "Traînage sur reddit",
                             "OH MON DIEU UN JOUEUR VITE GROUILLE-TOI DE CHARGER !",
                             "Obtention d'un Master",
                             "Ne jouez pas à ça en amphi les enfants",
                             "Écriture d'un algo génétique",
                             "Apprentissage du Javascript"];

      text_loading.text = loading_strings[this.game.rnd.integerInRange(0, loading_strings.length-1)] + '...';

      var tween_fade = game.add.tween(text_loading).to( { alpha: 0.2}, 500, Phaser.Easing.Linear.In, true, 0 , -1);
      tween_fade.yoyo(true, 0);

      //Images
      this.game.load.image('shot', 'assets/shot.png');
      this.game.load.image('explosion', 'assets/explosion.png');
      this.game.load.image('clear_wave', 'assets/clear.png');
      this.game.load.image('shield', 'assets/shield_WIP.png');
      this.game.load.image('space', 'assets/bg.png');
      this.game.load.image('boulimique', 'assets/special.png'); 

      //Spritesheets
      this.game.load.spritesheet('enemyshots', 'assets/enemyshots.png', 4, 8);
      this.game.load.spritesheet('enemy', 'assets/enemy.png', 16, 16);
      this.game.load.spritesheet('bonusship', 'assets/bonus_ship.png', 32, 16);
      this.game.load.spritesheet('ship', 'assets/ship24.png', 24, 28);
      this.game.load.spritesheet('powerups', 'assets/powerups.png', 15, 15);
      this.game.load.spritesheet('coin', 'assets/coin.png', 8, 8);
      this.game.load.spritesheet('menu_buttons', 'assets/menu_buttons.png', 96, 32);

      //Music
      this.game.load.audio('ambient', ['assets/audio/e1m1.mp3']);
      this.game.load.audio('ambient_ohgod', ['assets/audio/no_remorse.mp3']);
      this.game.load.audio('title', ['assets/audio/invaders.mp3']);
      this.game.load.audio('boss', ['assets/audio/boss.mp3']);
      this.game.load.audio('bonus_loop', ['assets/audio/mindlesslittleloop.mp3']);

      //Sounds
      this.game.load.audio('pickup', ['assets/audio/pickup.wav']);
      this.game.load.audio('pickup_coin', ['assets/audio/coin.wav']);
      this.game.load.audio('hellyeah', ['assets/audio/hellyeah.mp3']);
      this.game.load.audio('fire', ['assets/audio/fire.wav']);
      this.game.load.audio('firespecial', ['assets/audio/firespecial.wav']);
      this.game.load.audio('enemyfire', ['assets/audio/enemylaser.wav']);
      this.game.load.audio('explode', ['assets/audio/explode.wav']);
      this.game.load.audio('wave', ['assets/audio/wave.wav']);
      this.game.load.audio('hitenemy', ['assets/audio/hitenemy.wav']);  
      this.game.load.audio('killenemy', ['assets/audio/killenemy.mp3']);  
      this.game.load.audio('win', ['assets/audio/tunak-tunak-tun.mp3']);
      this.game.load.audio('gameover', ['assets/audio/gameover.ogg']); 
      this.game.load.audio('sax', ['assets/audio/sax.mp3']);

   },
   create: function() {
      console.log("-*- Preloaded -*-");
      this.game.stateTransition.to("GameTitle");
   }
}
