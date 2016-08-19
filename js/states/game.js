var invaders = function(game) { 
}

invaders.prototype = {
   // {{{ INIT
   init: function(config) {
      var self = this;
      console.log("Running the game...");
      console.log(self.config);

      // Groups
      self.player = null;
      self.enemies = null;
      self.items = null;
      self.bonusships = null;
      self.explosions = null;
      self.shield = null;

      // Weapons
      self.weapons = [];

      // Inputs
      self.cursors = null;
      self.fire_btn = null;
      self.special_btn = null;
      self.mute_btn = null;
      self.pause_btn = null;
      self.restart_btn = null;

      // Texts
      self.text_score = null;
      self.text_middle = null;
      self.text_level = null;
      self.text_ship = null;
      self.text_pause = null;
      self.text_score = null;

      // Timers
      self.timer = null;

      //Audio
      self.mute = false;
      self.gameoversound = false;
      self.introduction_sound = true;
      self.music = null;
      self.music_bonus = null;
      self.music_ohgod = null;
      self.pickup_sd = null;
      self.playerhit_sd = null;
      self.hitenemy_sd = null;
      self.killenemy_sd = null;
      self.abahe_sd = null;
      self.hellyeah_sd = null;
      self.fire_sd = null;
      self.firespecial_sd = null;
      self.enemyfire_sd = null;
      self.wave_sd = null;
      self.intro_sd = null;
      self.win_sd = null;
      self.over_sd = null;

      // Others
      difficulty = config.difficulty;
      currentDifficulty = config.difficulty;
      self.left = false;
      self.lostAlife = false;
      self.mute_wait = 0;
      self.speed = null;
      self.speedup = null;
      self.accel = null;
      self.current_level = config.current_level;
      self.current_bonus_level = config.current_bonus_level;
      self.in_bonus_level = config.is_bonus;
      self.in_boss_level = config.is_boss;
      self.just_end_bonus = false;
      self.wait_next_level = true;
      self.score = config.score;
      self.lives = config.lives;
      self.power = config.power;
      self.clear_nofiretime = 0;
      self.shield_time = 0;
      self.shots_cooldown = 0;
      self.special_cooldown = 0;
      self.special_available = 1;
      self.cooldown_reduction = config.cooldown_reduction;
      self.init_x = config.init_x;
      self.init_y = config.init_y;

      ENEMY_DEFAULT_FIRE_PROBA = 0.004 + difficulty*0.0015;
      POWERUP_CHANCE = 0.05 - difficulty*0.01;
      POWERUP_CHANCE_IN_BONUS = 2*POWERUP_CHANCE;
      MAX_POWER = (difficulty < OHGOD ? 7 : 5);

      console.log("DIFFICULTY = " + difficulty);
      console.log("FIRE PROBA = " + ENEMY_DEFAULT_FIRE_PROBA);
      console.log("POWERUP CHANCE = " + POWERUP_CHANCE);
      console.log("IN BONUS = " + POWERUP_CHANCE_IN_BONUS);
      console.log("MAX POWER = " + MAX_POWER);
   },
   // }}}
   // {{{ CREATE
   create: function() {
      var self = this;
      //Create the background
      
      self.background = game.add.tileSprite(0, 0, game.width, game.height, 'space');
      if (difficulty == OHGOD) {
         self.background.tint = 0xff0000;
      } else { 
         self.background.tint = 0x3355ee;
      }

      self.explosions = self.game.add.group();
      self.explosions.enableBody = true;

      self.enemies = self.game.add.group();
      self.enemies.enableBody = true;

      self.bonusships = self.game.add.group();
      self.bonusships.enableBody = true;

      self.items = self.game.add.group();

      self.shield = self.game.add.sprite(0, 0, 'shield');


      // Weapons
      self.weapons.push(new Weapon.Weapon1B(self));
      self.weapons.push(new Weapon.Weapon2B(self));
      self.weapons.push(new Weapon.Weapon3B(self));
      self.weapons.push(new Weapon.Weapon4B(self));
      self.weapons.push(new Weapon.Weapon5B(self));
      self.weapons.push(new Weapon.Weapon6B(self));
      self.weapons.push(new Weapon.Weapon7B(self));

      //Create the player's ship
      console.log("\tCreating player...");
      self.createPlayer();
      console.log("\t-*- Player created -*-");
      self.game.camera.follow(self.player); 

      //All inputs
      self.cursors = self.game.input.keyboard.createCursorKeys();
      self.fire_btn = self.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      self.special_btn = self.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
      self.mute_btn = self.game.input.keyboard.addKey(Phaser.Keyboard.M);
      self.pause_btn = self.game.input.keyboard.addKey(Phaser.Keyboard.P);
      self.restart_btn = self.game.input.keyboard.addKey(Phaser.Keyboard.R);

      //mute_btn.onUp.add(muteGame, self)
      self.pause_btn.onDown.add(self.pauseGame, self);

      //Ingame Text
      self.text_middle = self.game.add.text(self.game.world.width/2, self.game.world.height/2, '', {font: '32px Minecraftia', fill: '#ffffff'});
      self.text_middle.fixedToCamera = true;
      self.text_middle.anchor.setTo(0.5);

      self.text_pause = self.game.add.text(self.game.world.width/2, self.game.world.height/1.5, 'PAUSE', {font: '32px Minecraftia', fill: '#ffffff'});
      self.text_pause.fixedToCamera = true;
      self.text_pause.anchor.setTo(0.5);
      self.text_pause.alpha = 0;

      self.text_score = self.game.add.text(16, 5, '', {font: '16px Minecraftia', fill: '#00aaff'});
      self.text_score.fixedToCamera = true;

      self.text_level = self.game.add.text(self.game.world.width/2, game.world.height/2 + 40, '', {font: '16px Minecraftia', fill: '#00aaff'});
      self.text_level.fixedToCamera = true;
      self.text_level.anchor.setTo(0.5);

      self.music = self.game.add.audio('ambient');
      self.music.loop = true;
      self.music.volume = 1;
      self.music_bonus = self.game.add.audio('bonus_loop');
      self.music_bonus.loop = true;

      if (!self.mute && !self.music.isPlaying){
         self.music.play();
      }

      //Create all sounds
      self.pickup_sd = self.game.add.audio('pickup');
      self.hellyeah_sd = self.game.add.audio('hellyeah');
      self.playerhit_sd = self.game.add.audio('explode');
      self.hitenemy_sd = self.game.add.audio('hitenemy');
      self.hitenemy_sd.volume = 0.1;
      self.killenemy_sd = self.game.add.audio('killenemy');
      self.killenemy_sd.volume = 0.1;
      self.fire_sd = self.game.add.audio('fire');
      self.fire_sd.volume = 0.1;
      self.firespecial_sd = self.game.add.audio('firespecial');
      self.firespecial_sd.volume = 0.1;
      self.enemyfire_sd = self.game.add.audio('enemyfire');
      self.enemyfire_sd.volume = 0.1;
      self.wave_sd = self.game.add.audio('wave');
      self.intro_sd = self.game.add.audio('intro');
      self.win_sd = self.game.add.audio('win');
      self.over_sd = self.game.add.audio('over');

      self.text_ship = self.game.add.text(self.player.body.x - 20, self.player.body.y-20, '', {font: '16px Minecraftia', fill: '#44ff44'});
      self.text_ship.anchor.setTo(0.5, 0.5);
      self.text_ship.alpha = 0;

      self.speed = START_SPEED;
      self.speedup = SPEEDUP_INIT;
      self.accel = SPEEDUP_ACCEL;

      if (!self.in_bonus_level){
         console.log("\tLoading level " + self.current_level + " ...");
         self.loadLevel(self.current_level);
         console.log("\t-*- Level loaded -*-");
      } else {
         console.log("Loading bonus level " + self.current_bonus_level + " ...");
         self.loadBonusLevel(self.current_bonus_level);
         console.log("-*- Bonus level loaded -*-");
      }
      self.enemies.setAll('body.velocity.x', self.speed); 
   },

   // }}}
   // {{{ UPDATE
   update: function() {
      var self = this;
      
      if (currentDifficulty != difficulty) {
         currentDifficulty = difficulty;
         self.restart(self.current_level);
      }
      //Check collisions for everything
      self.game.physics.arcade.collide(self.weapon, self.enemies, self.hitEnemy, null, self);
      //self.game.physics.arcade.collide(self.explosions, self.enemies, self.hitEnemy, null, self);
      self.game.physics.arcade.collide(self.weapon, self.bonusships, self.hitBonusShip, null, self);
      //game.physics.arcade.collide(player, enemies, levelFailed, null, self)
      self.game.physics.arcade.collide(self.player, self.enemies, self.playerHit, function(){return (!self.lostAlife && self.shield_time == 0);}, self);
      //self.game.physics.arcade.collide(self.player, self.enemy_shots, self.playerHit, null, self);
      self.game.physics.arcade.collide(self.player, self.items, self.collectItem, function(){return (!self.lostAlife);}, self);



      self.text_score.text = 'Niveau ' + (self.current_level+1) + '    Score: ' + self.score + '   Vies: ' + self.lives + '\nPuissance: ' + self.power + ' Vitesse de tir: '+ self.cooldown_reduction +'    Tir spécial: ' + self.special_available;
      //background.tilePosition.y += current_level/5 + 1;
      self.background.tilePosition.y += 1 + (14*self.in_bonus_level); //FIXME

      //All controls are disabled when the player dies
      if (!self.lostAlife) {
         //Mute button
         if (self.mute_btn.isDown) {
            if (self.mute_wait == 0) {
               self.muteGame();
            }
         };

         //Control the player
         self.player.body.velocity.x = 0;
         self.player.body.velocity.y = 0;
         //if (!player.touched) {
         //player.body.velocity.y = 0; 
         //};
         if (self.cursors.up.isDown && difficulty < OHGOD) {
            self.player.body.velocity.y = -PLAYER_SPEED;
            self.player.body.velocity.x = 0; 
            //player.animations.play('left');
         } else if (self.cursors.down.isDown  && difficulty < OHGOD) {
            self.player.body.velocity.y = PLAYER_SPEED;
            self.player.body.velocity.x = 0; 
            //player.animations.play('right');
         }

         if (self.cursors.left.isDown) {
            self.player.body.velocity.x = -PLAYER_SPEED;
            //player.body.velocity.y = 0; 
            self.player.animations.play('left');
         } else if (self.cursors.right.isDown) {
            self.player.body.velocity.x = PLAYER_SPEED;
            //player.body.velocity.y = 0; 
            self.player.animations.play('right');
         } else if (!self.lostAlife) {
            self.player.animations.play('idle');
         }

         //Fire shots
         if (self.fire_btn.isDown) {
            self.weapon.fire(self.player);
         }

         //Fire super special shots 
         if (self.special_btn.isDown) {
            if (self.special_available > 0 && self.special_cooldown == 0) {
               self.weapon.fireSpecial(self.player);
               self.special_available--;
               self.special_cooldown = DEFAULT_FIRE_COOLDOWN
            }
         }		

         //Shield decay over time
         if (self.shield_time > 0) {
            self.shield_time--;
         } else {
            self.shield_time = 0;
         }
         self.shield.alpha = Math.min(self.shield_time/60.0, 0.75); //Fade the shield sprite with time

         //When a clear powerup is collected, enemies can't fire for a while
         if (self.clear_nofiretime > 0) {
            self.clear_nofiretime--;
         } else {
            self.clear_nofiretime = 0;
         }

         if (self.shots_cooldown > 0) {
            self.shots_cooldown--;
         } else {
            self.shots_cooldown = 0;
         }

         if (self.special_cooldown > 0) {
            self.special_cooldown--;
         } else {
            self.special_cooldown = 0;
         }


      } else {
         //When the player dies
         //console.log("DEAD ?");
         self.player.body.velocity.x = 0;
         self.player.animations.play('dead');
         //enemies.setAll('body.velocity.x', 0);
         if (self.lives == 0) {
            if (self.restart_btn.isDown) {
               //self.restart(0);
               self.music.stop();
               this.game.state.start("GameTitle");
            }
         }
      };

      if (self.mute_wait > 0) {
         self.mute_wait--;
      } else {
         self.mute_wait = 0;
      }

      //Move the enemies
      self.enemies.forEachAlive(function(enemy){
         enemy.animations.play('move');
         if (self.left) {
            self.enemies.setAll('body.velocity.x', -self.speed);   
         } else {
            self.enemies.setAll('body.velocity.x', self.speed);               
         }
         if (enemy.body.position.x < 10) {
            self.left = false;
            self.enemies.addAll('body.position.x', 10);        
            self.enemies.addAll('body.position.y', enemy.body.height);      
         } else if (enemy.body.position.x >= self.game.world.width - 25) {
            self.left = true;
            self.enemies.addAll('body.position.x', -10);
            self.enemies.addAll('body.position.y', enemy.body.height);
         }
         if (enemy.position.y > self.game.world.height) {
            self.levelFailed();
         }
      });

      //When the level is beaten
      //console.log("is beaten ?")

      self.living_e_shots = 0;
      self.enemies.forEach(function(e, cpt) {
         self.living_e_shots += e.livingShots();
      }, self);

      if (self.enemies.countLiving() == 0 && self.living_e_shots === 0 && self.current_level < levels.length && !self.wait_next_level) {
         self.bonusships.forEachAlive(function(bship) {
            if (bship.body.velocity.x == 0) {
               bship.kill();
               console.log("bonus ship en attente killé"); //FIXME
            }
         });
         console.log('level ' + (self.current_level+1) + ' beaten');
   
         //timer.start();
         //console.log(timer.seconds);
         if (self.in_bonus_level) {
            self.current_bonus_level++;
            self.current_bonus_level = self.current_bonus_level % bonus_levels.length;
            self.in_bonus_level = false;
            self.just_end_bonus = true;
            self.music_bonus.stop();
            self.music.play();
         }

         self.loadLevel(++self.current_level);
      }

      self.explosions.forEachAlive(function(expl) {
         //game.debug.body(expl);
         if (expl.alpha < 0.1) {
            expl.kill();
         }
      });

      self.bonusships.forEachAlive(function(bship) {
         if (bship.x > self.game.world.height + bship.body.width*2 || bship.x < -bship.body.width*2) {
            bship.kill();
         }
      });
   },
   // }}}

   // {{{ CREATEPLAYER
   createPlayer: function() {
      var self = this;
      self.player = self.game.add.sprite(self.init_x,self.init_y,'ship');
      self.game.physics.arcade.enable(self.player);

      self.player.body.collideWorldBounds = true;
      self.player.body.immovable = false;
      self.lostAlife = false;
      self.touched = false;

      self.player.anchor.setTo(0.5,0.5);

      self.player.animations.add('idle', [0,1],6,true);
      self.player.animations.add('left', [2,3],6,true);
      self.player.animations.add('right', [4,5],6,true);
      self.player.animations.add('dead', [6],6,true);

      self.weapon = self.weapons[self.power-1];
   },
   // }}}

   // {{{ LOADLEVEL
   // Load a level and its enemies
   loadLevel: function(lvl) {
      var self = this;
      if(lvl >= levels.length) {
         self.win_sd.play();
         self.game.add.tween(self.text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
         self.game.add.tween(self.text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);

         self.text_middle.text = "Niveaux tous finis !\n(pour l'instant)";
         self.text_level.text = "Merci d'avoir essayé !" ;
      } else {
         self.text_middle.text = "Niveau " + (lvl+1);
         self.text_level.text = level_names_fr[lvl];
         //text_level.text = level_names_en[lvl];
         self.text_middle.alpha = 0;
         self.text_level.alpha = 0;

         self.game.add.tween(self.text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
         self.game.add.tween(self.text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);


         if(speed_values[lvl]) {
            self.speed = speed_values[lvl][0]*(1+difficulty*0.15);
            self.speedup = speed_values[lvl][1]*(1+difficulty*0.15);
            self.accel = speed_values[lvl][2]/**(1+difficulty*0.2)*/;
         } else {
            self.speed = START_SPEED;
            self.speedup = SPEEDUP_INIT;
            self.accel = SPEEDUP_ACCEL;
         }

         self.wait_next_level = true;
         self.timer = game.time.create(true);
         self.timer.add(3000, function(){
            self.game.add.tween(self.text_middle).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
            self.game.add.tween(self.text_level).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
            console.log("\tCreating enemies...");
            self.createEnemies(levels[lvl]); 
            console.log("\t-*- Enemies created -*-");
            self.wait_next_level = false;
         });
         self.timer.start();

         //Set a delay for the bonus ship to come (20 to 40 secs)
         //createEnemies(levels[lvl]); 
         var delayForBonus = Math.random()*20*1000 + 20000;
         self.bonusShip(delayForBonus);
      }

   },
   // }}}

   // {{{ PAUSEGAME
   pauseGame: function() {
      var self = this;
      if (self.lives > 0) {
         if (!self.game.paused) {
            console.log("\tGame paused !");
            self.text_pause.alpha = 1;
            self.game.paused = true;
            self.music.pause();
         } else {
            console.log("\tGame resumed !");
            self.text_pause.alpha = 0;
            self.game.paused = false;
            if (!self.mute) {
               self.music.resume();
            }
         }
      }   
   },
   // }}}

   // {{{ BONUSSHIP
   // Prepares a bonus ship to appear after 'delay' seconds
   bonusShip: function(delay) {
      var self = this;
      console.log('\tbonus ship dans %.2f s',delay/1000);
      self.timer = self.game.time.create(true);
      self.timer.add(delay, function(){
         var bship = self.bonusships.getFirstDead();
         if(bship === null || bship === undefined) {
            bship = self.game.add.sprite(-32, 15, 'bonusship', 0); 
            self.bonusships.add(bship); 
         }
         else {
            bship.touched = false;
            bship.body.enable = true;
            bship.revive();
            bship.reset(-32,15);
         }
         bship.checkWorldBounds = true;
         bship.outOfBoundsKill = true;
         bship.animations.add('move', [0,1,2,3], 12, true);
         bship.animations.play('move');
         bship.value = 1000;  

         self.game.physics.arcade.enable(bship);
         if (Math.random() < 0.5) {
            bship.body.velocity.x = 90; 
         } else {
            bship.x = self.game.world.width + 10;
            bship.body.velocity.x = -90;
         }
      });
      self.timer.start();
   },
   // }}}

   // {{{ CREATEENEMIESABS
   // Creates an array of enemies at a set position
   createEnemies: function(array) {
      var self = this;
      var x = 10;
      var y = 30;
      for (var i = 0; i < array.length; i++) {
         for (var j = 0; j < array[i].length; j++) {
            if (array[i][j] > 0) {
               var xx = x+j*25;
               var yy = y+i*25;
               
               switch (array[i][j]) {
                  default:
                     break;
                  case 1: //ORANGE : normal
                     if (difficulty == OHGOD)
                        self.enemies.add(new Green(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     else
                        self.enemies.add(new Orange(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 2: //RED : fires multiple shots
                     if (difficulty == OHGOD)
                        self.enemies.add(new Magenta(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     else
                        self.enemies.add(new Red(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 3: //GREEN : fires fast shots
                     if (difficulty == OHGOD)
                        self.enemies.add(new DarkGreen(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     else
                        self.enemies.add(new Green(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 4: //PURPLE : fires twice as often
                     self.enemies.add(new Purple(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 5: //GRAY : takes 2 hits
                     self.enemies.add(new Gray(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 6: //YELLOW : Fires 5 shots when killed
                     self.enemies.add(new Yellow(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 7: //CYAN : fires gravity-affected shots
                     self.enemies.add(new Cyan(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 8: //PINK : takes 3 hits, fires more often
                     self.enemies.add(new Pink(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 9: //BLUE : fires in random directions
                     self.enemies.add(new Blue(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 10: //BROWN : explodes when killed
                     self.enemies.add(new Brown(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 11: //DARK GREEN : Fires REALLY FAST shots
                     self.enemies.add(new DarkGreen(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
                  case 12: //MAGENTA : Fires in a circle, takes 2 hits
                     self.enemies.add(new Magenta(self, xx, yy, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
                     break;
               }
            }
         }
      }   
   },
   // }}}

   // {{{ HITENEMY
   // When an enemy is hit by a player shot or an explosion
   hitEnemy: function(shot, enemy) {
      var self = this;
      var amount = shot.power;

      if (shot.key != 'explosion')  {
         shot.kill();
      }

      enemy.damage(amount);

      if (enemy.alive && !self.mute) {
         self.hitenemy_sd.play();
      }
   },
   // }}}

   // {{{ CREATEITEM
   // Generates a powerup to collect
   createItem: function(x, y, key) {
      var self = this;
      var item = self.game.add.sprite(x, y, key);
      self.game.physics.arcade.enable(item);
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
      self.items.add(item);
   },
   // }}}

   // {{{ CREATEEXPLOSION
   // Generates an explosion at the given coordinates
   createExplosion: function(x,y, pow) {
      var self = this;
      var expl = self.explosions.getFirstDead();
      if (expl === null || expl == undefined) {
         expl = self.game.add.sprite(x, y, 'explosion');
         self.explosions.add(expl);
      }
      else {
         expl.alpha = 1;
         expl.scale.setTo(1);
         expl.revive();
         expl.reset(x,y);
      }
      expl.power = pow;
      self.game.physics.arcade.enable(expl);
      expl.anchor.setTo(0.5);
      expl.smoothed = false;
      expl.body.immovable = true;
      expl.checkWorldBounds = true;
      expl.outOfBoundsKill = true;
      if (!self.mute) {
            self.playerhit_sd.play();
      }
      self.enemies.forEachAlive( function(e) {
         if (self.game.physics.arcade.distanceBetween(expl, e) < 40) {
            self.hitEnemy(expl, e);
         }
      });
      self.game.add.tween(expl).to( { alpha: 0}, 2000, Phaser.Easing.Quintic.Out, true);
      self.game.add.tween(expl.scale).to( {x: 2, y: 2 }, 1500, Phaser.Easing.Quintic.Out, true);
   },
   // }}}

   // {{{ PLAYERHIT
   // When the player is hit by enemy fire or an enemy 
   playerHit: function(player, shot) {
      var self = this;
      shot.kill();
      if (!self.lostAlife && !player.touched && !self.shield_time) {   
         console.log("TOUCHÉ !!!");
         self.playerhit_sd.play();
         self.lostAlife = true;
         player.touched = true;
         player.body.collideWorldBounds = false;
         player.body.velocity.y = 125;
         self.createExplosion(player.body.center.x, player.body.center.y, 20);
         //var tween_death = game.add.tween(player.body).to( { y: game.world.height+10 }, 1000, Phaser.Easing.Linear.None, true);

         if (!self.in_bonus_level) {
            //Player stats are halved
            if (difficulty == EASY) {
               if (self.power > 2) {
                  self.power /= 2;
                  self.power = Math.ceil(self.power);
               }
               else {
                  self.power = 2;
               }
            } else {
               if (self.power > 1) {
                  self.power /= 2;
                  self.power = Math.floor(self.power);
               }
            }
            self.weapon = self.weapons[self.power-1];
            
            if (self.cooldown_reduction > 0) {
               self.cooldown_reduction /= 2;
               self.cooldown_reduction = Math.floor(self.cooldown_reduction);
            }
            self.special_available = 1;
            self.lives--;
            if (self.lives > 0) {
               self.timer = self.game.time.create(true);
               self.timer.add(1500, function(){
                  player.body.collideWorldBounds = true;
                  //player.y = 550;
                  console.log("replace player");
                  self.game.add.tween(player.body).to( { y: 700 }, 500, Phaser.Easing.Quadratic.In, true);
                  self.game.add.tween(player.body).to( { x: 300 }, 500, Phaser.Easing.Quadratic.In, true);
                  self.lostAlife = false;
                  player.alpha = 0.5;
                  self.shield_time = 180;
                  player.addChild(self.shield);
                  self.shield.anchor.setTo(0.5, 0.5);
                  self.shield.smoothed = false;
               });
               self.timer.add(3000, function(){
                  player.touched = false;
                  player.alpha = 1;
               });
               self.timer.start();
            } else { //GAME OVER
               self.text_middle.alpha = 1;
               self.text_middle.text = 'GAME OVER';
               self.text_level.alpha = 1;
               self.text_level.text = 'Presser R pour recommencer';
            }
         } else {
            //If you die in a bonus level, no penalty
            self.timer = self.game.time.create(true);
            self.timer.add(1500, function(){
               player.body.collideWorldBounds = true;
               //player.y = 550;
               self.game.add.tween(player.body).to( { y: 700 }, 500, Phaser.Easing.Quadratic.In, true);
               self.game.add.tween(player.body).to( { x: 300 }, 500, Phaser.Easing.Quadratic.In, true);
               self.lostAlife = false;
               player.alpha = 0.5;
               self.enemies.removeAll(true);
               self.current_bonus_level--;
            });
            self.timer.add(3000, function(){
               player.touched = false;
               player.alpha = 1;
            });
            self.timer.start();
         }
      }
   },
   // }}}

   // {{{ COLLECTITEM
   // When a bonus item is collected
   collectItem: function(player, item) {
      var self = this;
      if (!self.lostAlife) {         
         switch (item.key) {
            case 'powerup_power': //Raises the player's firepower
               if (self.power < MAX_POWER) {
                  self.power++;
                  self.weapon = self.weapons[self.power-1];
                  self.weapon.fireRate -= self.cooldown_reduction*10;
               }        
               if (self.power == MAX_POWER) {
                  self.text_ship.text = "PUISSANCE MAX!";
               } else {
                  self.text_ship.text = "Puissance +!";
               }
               self.score += 300;
            break;
            case 'powerup_cooldown': //Raises the player's rate of fire
               if (self.cooldown_reduction < MAX_CDR) {
                  self.cooldown_reduction += 5;
                  self.weapon.fireRate -= self.cooldown_reduction*10;
               }
               if (self.cooldown_reduction >= MAX_CDR) {
                  self.cooldown_reduction = MAX_CDR;
                  self.text_ship.text = "VITESSE MAX!";
               } else {
                  self.text_ship.text = "Vitesse tir +!";
               }
               self.score += 300;
            break;            
            case 'powerup_special': //Gives a special shot charge
               self.special_available++;
               self.score += 500;
               self.text_ship.text = "Tir special +1!";
            break;

            case 'powerup_shield': //Gives a temporary shield
               player.addChild(self.shield);
               self.shield.anchor.setTo(0.5, 0.5);
               self.shield.smoothed = false;
               self.shield_time += (300 - difficulty * 60);
               if (!self.mute) {
                  //shield.play();
               }
               self.score += 500;
               self.text_ship.text = "Bouclier !";
            break;

            case 'powerup_kill': //Fires a large volley of shots
               // for (var i = -2; i <= 2; i++) { //Square version
               //    for (var j = -2; j <= 2; j++) {
               //       self.createShot(player.body.center.x, player.body.center.y, i*25, -600+(j*25));
               //    };
               // };
               for (var a = -Math.PI/4; a <= Math.PI/4; a += Math.PI/60) { //Arc version
                  //self.createShot(player.body.center.x, player.body.center.y, 300*Math.sin(a), -500-300*Math.cos(a), 15);
                  self.createShotPol(player.body.center.x, player.body.center.y, 500, a, 15);
                  self.createShotPol(player.body.center.x, player.body.center.y, 450, a, 15);
               }
               self.score += 750;
               self.text_ship.text = "KILL 'EM ALL !";
            break;

            case 'powerup_clear': //Clears the screen of enemy fire and prevents it for a while
               var wave = self.game.add.sprite(player.body.center.x, player.body.center.y, 'clear_wave');
               wave.anchor.setTo(0.5, 0.5);
               wave.smoothed = false;
               self.game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
               self.game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
               if (!self.mute) {
                  self.wave_sd.play();
               }
               self.score += 300;
               self.clear_nofiretime += 120; //Prevent enemy fire
               self.text_ship.text = "Neutralisation !";
            break;

            case 'powerup_orange': //Turn all enemies to default, orange ones
               var wave = self.game.add.sprite(player.body.center.x, player.body.center.y, 'clear_wave');
               wave.tint = 0xff7f00;
               wave.anchor.setTo(0.5, 0.5);
               wave.smoothed = false;
               self.game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
               self.game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
               if (!self.mute) {
                  self.wave_sd.play();
               }
               var already_all_orange = true;
               self.enemies.forEachAlive(function(e){ //Orangify all the enemies
                  if (e.type != 1) {
                     already_all_orange = false;
                  }
                  e = new Enemy.Orange(self, e.x, e.y, 'enemy', ENEMY_DEFAULT_FIRE_PROBA);
               });
               self.score += 500;
               if (!already_all_orange) {
                  self.text_ship.text = "Tous oranges !";
               } else {
                  self.text_ship.text = "Très utile !";
               }  
               
            break;

            case 'powerup_freeze': //Stops the enemies on a dime
               var wave = self.game.add.sprite(player.body.center.x, player.body.center.y, 'clear_wave');
               wave.tint = 0x007fff;
               wave.anchor.setTo(0.5, 0.5);
               wave.smoothed = false;
               self.game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
               self.game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
               if (!self.mute) {
                  self.wave_sd.play();
               }
               self.speed = 0;
               self.score += 400;
               self.text_ship.text = "Stop !";
            break;

            case 'powerup_warp': //Warps the enemies back to the top of the screen
               var highest = 1000; 
               self.enemies.forEachAlive(function(e) {
                  if (e.y < highest) {
                     highest = e.y;
                  }
               });
               self.enemies.forEachAlive(function(e) {
                  game.add.tween(e).to( {y: e.y - (highest-40)}, 1000, Phaser.Easing.Quadratic.Out, true);
               });
               self.score += 400;
               self.text_ship.text = "Retour en haut !";
            break;

            case 'extralife': //Gives an extra life
               self.lives++;
               self.score += 900;
               self.text_ship.text = "+1 vie !";
            break;

            case 'bonus_level': //Skips current level and warps the player to a bonus level
               self.loadBonusLevel();
               self.score += 3000;
               self.text_ship.text = "";
            break;
         }
         self.text_ship.alpha = 1;
         self.text_ship.x = player.body.x;
         self.text_ship.y = player.body.y - 10;
         var tween_bonus = self.game.add.tween(self.text_ship).to( { alpha: 0, y: player.body.y-40 }, 1000, Phaser.Easing.Linear.None, true);

         console.log(item.key + ' collected');

         if (!self.mute) {
            self.pickup_sd.play();
         }
         item.kill();
      }
   },
   // }}}

   // {{{ LEVELFAILED
   // When the level is failed by letting enemies go too low 
   levelFailed: function() {
      var self = this;
      if (!self.lostAlife) {   
         self.playerhit_sd.play();
         self.lostAlife = true;
         self.player.touched = true;
         self.player.body.collideWorldBounds = false;
         self.player.body.velocity.y = 125;
         self.createExplosion(self.player.body.center.x, self.player.body.center.y, 20);
         //var tween_death = game.add.tween(player.body).to( { y: game.world.height+10 }, 1000, Phaser.Easing.Linear.None, true);

         self.lives--;
         if (difficulty == EASY) {
            if (self.power > 2) {
               self.power /= 2;
               self.power = Math.ceil(power);
            }
         } else {
            if (self.power > 1) {
               self.power /= 2;
               self.power = Math.floor(self.power);
            }
         }
         if (self.cooldown_reduction > 0) {
            self.cooldown_reduction /= 2;
            self.cooldown_reduction = Math.floor(self.cooldown_reduction);
         }
         self.special_available = 1;
         self.current_level--;

         if (self.lives > 0) {
            self.timer = self.game.time.create(true);
            self.timer.add(3000, function(){
               self.player.body.collideWorldBounds = true;
               //player.body.velocity.y = -100;
               //player.body.position.y = 300; 
               self.enemies.removeAll(true);
               self.lostAlife = false;
               self.player.alpha = 0.5;
            });
            self.timer.add(4000, function(){
               self.player.touched = false;
               self.player.alpha = 1;
               self.shield_time = 240;
            });
            self.timer.start();
         } else { //GAME OVER
            self.text_middle.alpha = 1;
            self.text_middle.text = 'GAME OVER';
            self.text_level.alpha = 1;
            self.text_level.text = 'Presser R pour recommencer';
         }
      }
   },
   // }}}

   // {{{ HITBONUSSHIP
   // When the player successfully hits a bonus ship
   hitBonusShip: function(shot, bship) {
      var self = this;
      shot.kill();
      if (!bship.touched) {
         bship.touched = true;
         bship.animations.stop();
         bship.body.enable = false;
         self.score += bship.value;
         if (!self.mute) {
            self.killenemy_sd.play();
         }
         bship.kill();

         //randomly create a bonus
         var random = Math.random() * 110;
         if (random <= 10) {
            self.createItem(bship.body.center.x, bship.body.center.y, 'extralife');
         }
         if (random > 10 && random <= 25) {
            self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_power');
         }
         if (random > 25 && random <= 40) {
            self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_cooldown');
         }
         if (random > 40 && random <= 55) {
            self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_special');
         }           
         if (random > 55 && random <= 70) {
            self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_freeze');
         }
         if (random > 70 && random <= 80) {
            self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_warp');
         }           
         if (random > 80 && random <= 90) {
            //self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_kill');
         }           
         if (random > 90 && random <= 100) {
            //self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_orange');
         }
         if (random > 100 && random <= 110) {
            self.createItem(bship.body.center.x, bship.body.center.y, 'bonus_level');
         }
      }
   },
   // }}}

   // {{{ MUTEGAME
   muteGame: function() {
      var self = this;
      if (!self.mute) {
         self.mute = true;
         self.music.pause()
         self.music_bonus.pause();
      } else {
         self.mute = false;
         if (self.in_bonus_level) {
            self.music_bonus.resume();
         } else {
            self.music.resume();
         }
      }

      console.log('mute is ' + self.mute);
      self.mute_wait = 30;
   },
   // }}}

   // {{{ ONLYN
   // Generates a level with only one type of enemy
   only: function(n) {
      return [[0,0,n,n,n,n,n,n,0,0],
            [0,n,n,n,n,n,n,n,n,0],
            [n,n,n,n,n,n,n,n,n,n],
            [n,n,n,n,n,n,n,n,n,n]];

   },
   // }}}

   // {{{ RESTART
   // Restarts the game from zero
   restart: function(level) {
      var self = this;
      self.items.removeAll();
      self.bonusships.removeAll();
      self.enemies.removeAll(true);
      self.player.kill();
      self.music.stop();
      self.music_bonus.stop();
      var config = {
         is_boss: false,
         is_bonus: false,
         score: 0,
         lives: 3,
         power: self.difficulty == EASY ? 2 : 1,
         init_x: 300,
         init_y: 700,
         difficulty: self.difficulty,
         current_level: 0,
         special_available: 1,
         cooldown_reduction: 0,
         current_bonus_level: 0,
      };
      this.game.state.start("Game", true, false, config);
   },
   // }}}

   // {{{ LOADNEXTLEVEL
   // Load the next level when the current is beaten
   loadNextLevel: function() {
      var self = this;
      self.items.removeAll();
      self.bonusships.removeAll();
      self.enemies.removeAll(true);
      self.player.kill();
      var config = {
         is_boss: false,
         is_bonus: false,
         score: self.score,
         lives: self.lives,
         power: self.power,
         init_x: self.player.x,
         init_y: self.player.y,
         difficulty: self.difficulty,
         isPlaying: self.music.isPlaying,   
         special_available: self.special_available,
         cooldown_reduction: self.cooldown_reduction,
         current_bonus_level: self.current_bonus_level,
         current_level: self.just_end_bonus ? self.current_level : self.current_level+1,
      };
      if (self.just_end_bonus)
         self.just_end_bonus = false;
      self.game.state.start("Game", true, false, config);
   },
   // }}}

   // {{{ LOADBONUSLEVEL
   // Loads the next bonus level
   loadBonusLevel: function() {
      var self = this;
      self.in_bonus_level = true;
      self.music.stop();
      self.music_bonus.play();
      self.items.removeAll();
      self.bonusships.removeAll();
      self.enemies.removeAll(true);

      self.text_middle.text = "Niveau bonus !";
      self.text_level.text = "YAY ! (il est en travaux btw)";
      //text_level.text = level_names_en[lvl];
      self.text_middle.alpha = 0;
      self.text_level.alpha = 0;

      self.game.add.tween(self.text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
      self.game.add.tween(self.text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);


      self.speed = START_SPEED;
      self.speedup = SPEEDUP_INIT;
      self.accel = SPEEDUP_ACCEL;
      /*timer = new Phaser.Timer(game, false);
      timer.add(Phaser.Timer.SECOND*2, createEnemies(levels[lvl]), this);
      timer.start(2000);
      */
      self.timer = self.game.time.create(true);
      self.timer.add(3000, function(){
         self.game.add.tween(self.text_middle).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
         self.game.add.tween(self.text_level) .to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
         //createEnemies(levels[lvl]);   
      }, 3000);
      self.timer.start();
      self.wait_next_level = true;
      self.createEnemies(bonus_levels[self.current_bonus_level]);
      self.wait_next_level = false;
   },
   // }}}
}

