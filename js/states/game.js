var invaders = function(game) { 
}

invaders.prototype = {
   init: function(difficulty, level, power, firerate) {
      // Groups
      this.player = null;
      this.enemies = null;
      this.items = null;
      this.shots = null;
      this.special_shots = null;
      this.enemy_shots = null;
      this.bonusships = null;
      this.explosions = null;
      this.shield = null;

      // Inputs
      this.cursors = null;
      this.fire_btn = null;
      this.special_btn = null;
      this.mute_btn = null;
      this.pause_btn = null;
      this.restart_btn = null;

      // Texts
      this.text_score = null;
      this.text_middle = null;
      this.text_level = null;
      this.text_ship = null;
      this.text_pause = null;
      this.text_score = null;

      // Timers
      this.timer = null;

      //Audio
      this.mute = true;
      this.gameoversound = false;
      this.introduction_sound = false;
      this.music = null;
      this.music_bonus = null;
      this.music_ohgod = null;
      this.pickup_sd = null;
      this.playerhit_sd = null;
      this.hitenemy_sd = null;
      this.killenemy_sd = null;
      this.abahe_sd = null;
      this.hellyeah_sd = null;
      this.fire_sd = null;
      this.firespecial_sd = null;
      this.enemyfire_sd = null;
      this.wave_sd = null;
      this.intro_sd = null;
      this.win_sd = null;
      this.over_sd = null;

      // Others
      this.left = false;
      this.lostAlife = false;
      this.mute_wait = 0;
      this.speed = null;
      this.speedup = null;
      this.accel = null;
      this.current_level = 0;
      this.current_bonus_level = 0;
      this.in_bonus_level = false;
      this.in_boss_level = false;
      this.wait_next_level = true;
      this.score = 0;
      this.lives = 3;
      this.power = (difficulty == EASY ? 2 : 1);
      this.shield_time = 0;
      this.shots_cooldown = 0;
      this.special_cooldown = 0;
      this.special_available = 1;
      this.cooldown_reduction = 0;
      this.random = 1; 
   },
   create: function() {
      //Create the background
      this.background = game.add.tileSprite(0, 0, game.width, game.height, 'space');
      if (difficulty == OHGOD) {
         this.background.tint = 0xff0000;
      } else { 
         this.background.tint = 0x3355ee;
      }
      this.shots = this.game.add.group();
      this.shots.enableBody = true;

      // little optimization
      for (var i = 0; i < 200; i++) {
         var shot = this.game.add.sprite(0,0,'shot');
         this.shots.add(shot);
         shot.anchor.setTo(0.5, 0.5);
         shot.kill();
      }

      this.special_shots = this.game.add.group();
      this.special_shots.enableBody = true;

      this.enemy_shots = this.game.add.group();
      this.enemy_shots.enableBody = true;
      
      this.explosions = this.game.add.group();
      this.explosions.enableBody = true;
      for(var i = 0; i < 100; i++) {
         var explosion = this.game.add.sprite(0,0,'explosion');
         this.game.physics.arcade.enable(explosion);
         explosion.anchor.setTo(0.5,0.5);
         explosion.smoothed = false;
         explosion.body.immovable = true;
         this.explosions.add(explosion);
         explosion.kill();
      }

      this.enemies = this.game.add.group();
      this.enemies.enableBody = true;
      
      this.bonusships = this.game.add.group();
      this.bonusships.enableBody = true;
      
      this.items = this.game.add.group();

      this.shield = this.game.add.sprite(0, 0, 'shield');

      //Create the player's ship
      createPlayer();
      this.game.camera.follow(this.player);

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

      text_ship = game.add.text(player.body.x - 20, player.body.y-20, '', {font: '16px Minecraftia', fill: '#44ff44
         '});
      text_ship.anchor.setTo(0.5, 0.5);
      text_ship.alpha = 0;

      speed = START_SPEED;
      speedup = SPEEDUP_INIT;
      accel = SPEEDUP_ACCEL;

      loadLevel(0);
      enemies.setAll('body.velocity.x', speed); 
   }
}
