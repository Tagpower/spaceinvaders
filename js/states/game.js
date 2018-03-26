var invaders = function(game) { 
   Phaser.State.call(this);
}

invaders.prototype = Object.create(Phaser.State);
invaders.prototype.constructor = invaders;

invaders.prototype = {
   // {{{ INIT
   init: function(config) {
      var self = this;
      console.log("Running the game...");
      console.log(self.config);

      // Others
      difficulty = config.difficulty;
      currentDifficulty = config.difficulty;

      // $('body, footer, .nav-wrapper, .footer-copyright').removeClass('blue');
      // $('body, footer, .nav-wrapper, .footer-copyright').removeClass('green');
      // $('body, footer, .nav-wrapper, .footer-copyright').removeClass('yellow');
      // $('body, footer, .nav-wrapper, .footer-copyright').removeClass('red');
      // $('body, footer, .nav-wrapper, .footer-copyright').removeClass('black');
      // $('body, footer, .nav-wrapper, .footer-copyright').removeClass('toto');

      if (difficulty == OHGOD) {
            $('body, footer, .nav-wrapper, .footer-copyright').toggleClass('red');
      }

      self.current_level = config.current_level;
      self.current_bonus_level = config.current_bonus_level;
      self.in_bonus_level = config.is_bonus;
      self.in_boss_level = config.is_boss;
      self.score = config.score;
      self.lives = config.lives;
      self.coins = 0;
      self.power = config.power;
      self.cooldown_reduction = config.cooldown_reduction;
      self.init_x = config.init_x;
      self.init_y = config.init_y;
      self.special_available = config.special_available;

      ENEMY_DEFAULT_FIRE_PROBA = 0.004 + difficulty*0.0015;
      POWERUP_CHANCE = 0.05 - difficulty*0.01;
      POWERUP_CHANCE_IN_BONUS = 2*POWERUP_CHANCE;
      COINS_FOR_POWERUP = 50 + difficulty*25;
      MAX_POWER = (difficulty < OHGOD ? 7 : 5);

      console.log("DIFFICULTY = " + difficulty);
      console.log("FIRE PROBA = " + ENEMY_DEFAULT_FIRE_PROBA);
      console.log("POWERUP CHANCE = " + POWERUP_CHANCE);
      console.log("IN BONUS = " + POWERUP_CHANCE_IN_BONUS);
      console.log("COIN CHANCE = " + COIN_CHANCE);
      console.log("IN BONUS = " + COIN_CHANCE_IN_BONUS);
      console.log("COINS FOR BONUS = " + COINS_FOR_POWERUP);
      console.log("MAX POWER = " + MAX_POWER);

      self.READY = false;
   },
   // }}}
   // {{{ CREATE
   create: function() {
      var self = this;
      //Create the background

      self.background = game.add.tileSprite(0, 0, game.width, game.height, 'space');
      self.background.tint = (difficulty == OHGOD ? 0xff1111 : 0x3355ee);

      // Weapons
      self.weapons = [];

      //Audio
      self.mute = false;
      self.gameoversound = true;
      self.introduction_sound = true;

      self.left = false;
      self.lostAlife = false;
      self.mute_wait = 0;
      self.just_end_bonus = false;
      self.wait_next_level = true;
      self.clear_nofiretime = 0;
      self.shield_time = 0;
      self.shots_cooldown = 0;
      self.special_cooldown = 0;

      self.explosions = self.game.add.group();
      self.explosions.enableBody = true;

      self.enemies = self.game.add.physicsGroup();

      self.bonusships = self.game.add.group();
      self.bonusships.enableBody = true;

      self.items = self.game.add.group();
      self.items.enableBody = true;

      self.shield = self.game.add.sprite(0, 0, 'shield');
      self.shield.anchor.setTo(0.5, 0.5);
      self.shield.smoothed = false;

      self.scorePool = 0;
      self.game.scorePoolTimer = self.game.time.events;
      self.game.scorePoolTimer.loop(10, function() {
         self.scorePoolNotRunning = false;
         self.scorePool -= 25;
         self.score += 25;
      }, self);
      self.game.scorePoolTimer.stop(false);
      self.scorePoolNotRunning = true;

      // Weapons
      self.weapons.push(self.game.add.existing(new Weapon1B(self)));
      self.weapons.push(self.game.add.existing(new Weapon2B(self)));
      self.weapons.push(self.game.add.existing(new Weapon3B(self)));
      self.weapons.push(self.game.add.existing(new Weapon4B(self)));
      self.weapons.push(self.game.add.existing(new Weapon5B(self)));
      self.weapons.push(self.game.add.existing(new Weapon6B(self)));
      self.weapons.push(self.game.add.existing(new Weapon7B(self)));
      self.weapons.push(self.game.add.existing(new WeaponKill(self))); //TODO faire gaffe à ce qu'on l'ait pas en prenant un Power+

      //Create the player's ship
      console.log("\tCreating player...");
      self.createPlayer();
      console.log("\t-*- Player created -*-");
      self.game.camera.follow(self.player); 

      self.player.addChild(self.shield);

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
      var style_white = {font: '32px Minecraftia', fill:'#ffffff'};
      var style_blue  = {font: '16px Minecraftia', fill:'#00aaff'};
      var style_blue_small  = {font: '12px Minecraftia', fill:'#00aaff'};
      var style_green  = {font: '16px Minecraftia', fill:'#44ff44'};
      var style_yellow  = {font: '16px Minecraftia', fill:'#ffee00'};

      self.text_middle = self.game.add.text(self.game.world.width/2, self.game.world.height/2, '', style_white);
      self.text_middle.fixedToCamera = true;
      self.text_middle.anchor.setTo(0.5);

      self.text_pause = self.game.add.text(self.game.world.width/2, self.game.world.height/1.5, '', style_white);
      self.text_pause.fixedToCamera = true;
      self.text_pause.anchor.setTo(0.5);
      //self.text_pause.alpha = 0;

      self.text_hint = self.game.add.text(self.game.world.width/2, self.game.world.height - 100, '', style_blue_small);
      self.text_hint.fixedToCamera = true;
      self.text_hint.anchor.setTo(0.5);
      self.text_hint.alpha = 0;

      self.text_score = self.game.add.text(16, 5, '', style_blue);
      self.text_score.fixedToCamera = true;

      self.text_lives = self.game.add.text(48, 42, self.lives, style_blue);
      self.text_lives.anchor.setTo(0.5);
      self.text_lives.smoothed = false;

      self.text_power = self.game.add.text(92, 42, self.power, style_blue);
      self.text_power.anchor.setTo(0.5);
      self.text_power.smoothed = false;

      self.text_coold = self.game.add.text(136, 42, self.cooldown_reduction, style_blue);
      self.text_coold.anchor.setTo(0.5);
      self.text_coold.smoothed = false;

      self.text_specs = self.game.add.text(180, 42, self.special_available, style_blue);
      self.text_specs.anchor.setTo(0.5);
      self.text_specs.smoothed = false;

      self.game.add.sprite(20, 29, 'powerups', 12);
      self.game.add.sprite(64, 29, 'powerups', 39);
      self.game.add.sprite(108, 29, 'powerups', 7);
      self.game.add.sprite(152, 29, 'powerups', 27);

      self.text_level = self.game.add.text(self.game.world.width/2, game.world.height/2 + 40, '', style_blue);
      self.text_level.fixedToCamera = true;
      self.text_level.anchor.setTo(0.5);

      self.text_ship = self.game.add.text(self.player.body.x - 20, self.player.body.y-20, '', style_green);
      self.text_ship.anchor.setTo(0.5);
      self.text_ship.alpha = 0;

      self.text_coin = self.game.add.text(self.player.body.x, self.player.body.y-20, '', style_yellow);
      self.text_coin.anchor.setTo(0.5);
      self.text_coin.alpha = 0;



      if (difficulty < OHGOD) {
         self.music = self.game.add.audio('ambient');
      } else {
         self.music = self.game.add.audio('ambient_ohgod');
      }
      self.music.loop = true;

      self.music_boss = self.game.add.audio('boss');
      self.music_boss.loop = true;

      self.music_bonus = self.game.add.audio('bonus_loop');
      self.music_bonus.loop = true;

      if (!self.mute && !self.music.isPlaying){
         self.music.play();
      }

      //Create all sounds
      self.pickup_sd = self.game.add.audio('pickup');
      self.pickup_sd.volume = 0.5;
      self.pickupcoin_sd = self.game.add.audio('pickup_coin');
      self.pickupcoin_sd.volume = 0.5;
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
      self.gameover_sd = self.game.add.audio('gameover');


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

      //self.game.saveCpu.renderOnFPS = 60;
      self.READY = true;
   },

   // }}}
   // {{{ UPDATE
   update: function() {
      var self = this;
      if (self.READY) {
         if (currentDifficulty != difficulty) {
            currentDifficulty = difficulty;
            self.restart(self.current_level);
         }

         if (self.scorePool > 0 && self.scorePoolNotRunning)
            self.game.scorePoolTimer.start(1);
         else if (self.scorePool == 0) {
            self.game.scorePoolTimer.stop(false);
            self.scorePoolNotRunning = true;
         }

         //Check collisions for everything
         self.game.physics.arcade.collide(self.weapon, self.enemies, self.hitEnemy, null, self);
         self.game.physics.arcade.collide(self.player, self.enemies, self.playerHit, function() {return self.shield_time == 0 && !self.lostAlife;}, self);

         self.text_score.text = 'Niveau ' + (self.current_level+1) + '    Score: ' + ('000000000' + Math.round(self.score)).slice(-10);

         //self.text_stats.text = '        ' + self.lives + '        ' + self.power + '        '+ self.cooldown_reduction + '        ' + self.special_available;
         self.text_lives.text = self.lives;
         self.text_specs.fill = (self.lives > 1 ? '#00aaff' : '#ff0000');

         self.text_power.text = self.power;
         self.text_power.fill = (self.power == MAX_POWER ? '#ffff00' : '#00aaff');

         self.text_coold.text = self.cooldown_reduction;
         self.text_coold.fill = (self.cooldown_reduction == MAX_CDR ? '#ffff00' : '#00aaff');

         self.text_specs.text = self.special_available;
         self.text_specs.fill = (self.special_available > 0 ? '#00aaff' : '#aaaaaa');

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
               if (self.special_available > 0 && self.special_cooldown === 0) {
                  self.weapon.fireSpecial(self.player);
                  self.special_available--;
                  self.special_cooldown = 100;
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
                  self.music_boss.stop();
                  self.gameover_sd.stop(); // FIXME
                  this.game.stateTransition.to("GameTitle", true, false);
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
            if (self.left) {
               self.enemies.setAll('body.velocity.x', -self.speed);   
            } else {
               self.enemies.setAll('body.velocity.x', self.speed);               
            }
            if (enemy.body.position.x < 10) {
               self.left = false;
               if (!self.in_boss_level) {
                  self.enemies.addAll('body.position.x', 10);        
                  self.enemies.addAll('body.position.y', enemy.body.height);      
               }
            } else if (enemy.body.position.x >= self.game.world.width - 25) {
               self.left = true;
               if (!self.in_boss_level) {
                  self.enemies.addAll('body.position.x', -10);
                  self.enemies.addAll('body.position.y', enemy.body.height);
               }
            }
            if (enemy.position.y > self.game.world.height && !self.in_boss_level) {
               self.levelFailed();
            }
         });

         //When the level is beaten
         self.living_e_shots = 0;
         self.enemies.forEach(function(e, cpt) {
            self.living_e_shots += e.livingShots();
         }, self);

         if (self.enemies.countLiving() == 0 && self.living_e_shots === 0 && self.current_level < levels.length && !self.wait_next_level) {
            console.log('level ' + (self.current_level+1) + ' beaten');

            if (self.in_bonus_level) {
               self.current_bonus_level++;
               self.current_bonus_level = self.current_bonus_level % bonus_levels.length;
               self.in_bonus_level = false;
               self.just_end_bonus = true;
               self.music_bonus.stop();
               self.music.play();
            } else if (self.in_boss_level) {
               self.in_boss_level = false;
               self.music_boss.stop();
               self.music.play();
            }



            self.loadLevel(++self.current_level);
         }

         self.explosions.forEachAlive(function(expl) {
            //game.debug.body(expl);
            if (expl.alpha < 0.2) {
               expl.kill();
            }
         });

         self.bonusships.forEachAlive(function(bship) {
            if (bship.x > self.game.world.height + bship.body.width*2 || bship.x < -bship.body.width*2) {
               bship.outOfBounds = true;
               bship.kill();
            }
         });
      }
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
         if ((lvl+1) % 20 == 0) {
            self.in_boss_level = true;
            self.text_level.fill = '#ff2222';
            self.text_middle.text = "BOSS";
            self.music.stop();
            self.music_boss.play();
         } else {
            self.text_level.fill = '#00aaff';
            self.text_middle.text = "Niveau " + (lvl+1);
         }

         self.text_level.text = level_names_fr[lvl];
         //text_level.text = level_names_en[lvl];
         if (hints_fr.get(lvl)) {
            self.text_hint.text = "Astuce : " + hints_fr.get(lvl);
            self.game.add.tween(self.text_hint).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
         }
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
            self.game.add.tween(self.text_hint).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.In, true);
            console.log("\tCreating enemies...");
            self.createEnemies(levels[lvl]); 
            //self.createEnemies(self.only(101)); //DO NOT UNCOMMENT THIS I BEG YOU
            console.log("\t-*- Enemies created -*-");
            self.wait_next_level = false;
         });
         self.timer.start();

         //Set a delay for the bonus ship to come (15 to 40 secs)
         //if (!self.in_boss_level) {
            var delayForBonus = Math.random()*25*1000 + 15000;
            self.bonusShip(delayForBonus);
         //}
      }

   },
   // }}}

   // {{{ PAUSEGAME
   pauseGame: function() {
      var self = this;
      if (self.lives > 0) {
         if (!self.game.paused) {
            console.log("\tGame paused !");
            if (!self.mute) {
               self.pickupcoin_sd.play();
            }
            self.text_pause.alpha = 1;
            self.text_pause.text = "PAUSE";
            self.game.paused = true;
            self.music.pause();
            self.music_boss.pause();
         } else {
            console.log("\tGame resumed !");
            self.text_pause.alpha = 0;
            self.text_pause.text = "";
            self.game.paused = false;
            if (!self.mute) {
               self.pickupcoin_sd.play();
               if (self.in_boss_level) {
                  self.music_boss.resume();
               } else {
                  self.music.resume();
               }
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
         var x = -6;

         if (bship === null || bship === undefined) {
            bship = new BonusShip(self, x, 15, 'bonusship', 0, 1000, 10, [0,1,2,3], 12);
            self.bonusships.add(bship);
         }
         else{
            bship.revive();
            bship.outOfBounds = false;
            bship.reset(x, 15);
            if (Math.random() < 0.5) {
               bship.x = -16;
               bship.body.velocity.x = 90; 
            } else {
               bship.x = game.world.width + 7;
               bship.body.velocity.x = -90;
            }
         }
      });
      self.timer.start();
   },
   // }}}

   // {{{ CREATEENEMIES
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
                        self.enemies.add(new Green(self, xx, yy, 'enemy'));
                     else
                        self.enemies.add(new Orange(self, xx, yy, 'enemy'));
                     break;
                  case 2: //RED : fires multiple shots
                     if (difficulty == OHGOD)
                        self.enemies.add(new DarkRed(self, xx, yy, 'enemy'));
                     else
                        self.enemies.add(new Red(self, xx, yy, 'enemy'));
                     break;
                  case 3: //GREEN : fires fast shots
                     if (difficulty == OHGOD)
                        self.enemies.add(new DarkGreen(self, xx, yy, 'enemy'));
                     else
                        self.enemies.add(new Green(self, xx, yy, 'enemy'));
                     break;
                  case 4: //PURPLE : fires twice as often
                     self.enemies.add(new Purple(self, xx, yy, 'enemy'));
                     break;
                  case 5: //GRAY : takes 2 hits
                     self.enemies.add(new Gray(self, xx, yy, 'enemy'));
                     break;
                  case 6: //YELLOW : Fires 5 shots when killed
                     self.enemies.add(new Yellow(self, xx, yy, 'enemy'));
                     break;
                  case 7: //CYAN : fires gravity-affected shots
                     self.enemies.add(new Cyan(self, xx, yy, 'enemy'));
                     break;
                  case 8: //PINK : takes 3 hits, fires more often
                     self.enemies.add(new Pink(self, xx, yy, 'enemy'));
                     break;
                  case 9: //BLUE : fires in random directions
                     self.enemies.add(new Blue(self, xx, yy, 'enemy'));
                     break;
                  case 10: //BROWN : explodes when killed
                     self.enemies.add(new Brown(self, xx, yy, 'enemy'));
                     break;
                  case 11: //DARK GREEN : Fires REALLY FAST shots
                     self.enemies.add(new DarkGreen(self, xx, yy, 'enemy'));
                     break;
                  case 12: //DARK RED : Fires in a circle
                     self.enemies.add(new DarkRed(self, xx, yy, 'enemy'));
                     break;
                  case 13: //BLACK : Sometimes moves down when firing
                     self.enemies.add(new Black(self, xx, yy, 'enemy'));
                     break;
                  case 14: //WHITE : COMING SOON
                     self.enemies.add(new White(self, xx, yy, 'enemy'));
                     break;
                  case 15: //DARK CYAN : Fires revolving shots
                     self.enemies.add(new DarkCyan(self, xx, yy, 'enemy'));
                     break;
                  case 16: //MAGENTA : Fires growing shots, takes 2 hits
                     self.enemies.add(new Magenta(self, xx, yy, 'enemy'));
                     break;
                  case 101: // OTTERFUCKER !!! BOSS #1
                     self.enemies.add(new Boulimique(self, xx, yy, 'boulimique'));
                     break;
                  case 102: // OTTERFUCKER !!! BOSS #2
                     self.enemies.add(new GrosSac(self, xx, yy, 'boulimique'));
                     break
               }
            }
         }
      }   
      self.game.world.bringToTop(self.enemies);
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

   // {{{ CREATEEXPLOSION
   // Generates an explosion at the given coordinates
   createExplosion: function(x,y, pow, rad=40) {
      var self = this;
      var expl = self.explosions.getFirstDead();
      if (expl === null || expl == undefined) {
         expl = self.game.add.sprite(x, y, 'explosion');
         self.explosions.add(expl);
      }
      else {
         expl.revive();
         expl.reset(x,y);
      }
      expl.alpha = 1;
      expl.scale.setTo(1);
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
      self.enemies.forEachAlive( function(e, rad) {
         if (self.game.physics.arcade.distanceBetween(expl, e) < rad) {
            self.hitEnemy(expl, e);
         }
      }, self, rad);
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
               self.weapon.fireRate = self.weapon.baseFireRate * (1-self.cooldown_reduction/100.0);
            }
            self.special_available = 1;
            self.coins /= 2;
            self.coins = Math.floor(self.coins);
            self.lives--;

            if (self.lives > 0) {
               self.timer = self.game.time.create(true);
               self.timer.add(1500, function(){
                  player.body.collideWorldBounds = true;
                  //player.y = 550;
                  console.log("replace player");
                  self.game.add.tween(player.body).to( { y: 600 }, 500, Phaser.Easing.Quadratic.In, true);
                  self.lostAlife = false;
                  self.shield_time = 180;
                  player.addChild(self.shield);
                  self.shield.anchor.setTo(0.5, 0.5);
                  self.shield.smoothed = false;
               });
               self.timer.add(3000, function(){
                  player.touched = false;
               });
               self.timer.start();
            } else { //GAME OVER
               self.gameOver();
            }
         } else {
            //If you die in a bonus level, no penalty
            self.timer = self.game.time.create(true);
            self.timer.add(1500, function(){
               player.body.collideWorldBounds = true;
               self.game.add.tween(player.body).to( { y: 600 }, 500, Phaser.Easing.Quadratic.In, true);
               self.lostAlife = false;
               self.enemies.removeAll(true);
               self.current_bonus_level--;
            });
            self.timer.add(3000, function(){
               player.touched = false;
            });
            self.timer.start();
         }
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
               self.power = Math.ceil(self.power);
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
            self.weapon.fireRate = self.weapon.baseFireRate * (1-self.cooldown_reduction/100.0);
         }
         self.special_available = 1;
         self.coins /= 2;
         self.coins = Math.floor(self.coins);
         self.current_level--;

         if (self.lives > 0) {
            self.timer = self.game.time.create(true);
            self.timer.add(3000, function(){
               self.player.body.collideWorldBounds = true;
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
            self.gameOver();
         }
      }
   },
   // }}}

   gameOver: function() {
      var self = this;

      self.text_middle.alpha = 1;
      self.text_middle.text = 'GAME OVER';
      self.text_level.alpha = 1;
      self.text_level.text = 'Presser R pour recommencer';
      self.music.stop();
      self.music_boss.stop();
      self.music_bonus.stop();
      self.gameover_sd.play();

      //this.game.state.start("GameOver");
   },

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
      self.music.stop();;
      self.music_boss.stop();
      self.music_bonus.stop();
      var config = {
         is_boss: false,
         is_bonus: false,
         score: 0,
         lives: 3,
         power: self.difficulty == EASY ? 2 : 1,
         init_x: 300,
         init_y: 600,
         difficulty: self.difficulty,
         current_level: 0,
         special_available: 1,
         cooldown_reduction: 0,
         current_bonus_level: 0,
      };
      this.game.state.start("Game", true, false, config);
   },
   // }}}

   // {{{ LOADBONUSLEVEL
   // Loads the next bonus level
   loadBonusLevel: function() {
      var self = this;
      if (self.in_bonus_level) {
         self.current_bonus_level++;
         self.current_bonus_level %= bonus_levels.length;
      }
      self.in_bonus_level = true;
      self.music.stop();
      self.music_bonus.play();
      //self.items.removeAll(); //FIXME
      self.bonusships.removeAll();
      self.enemies.forEach(function(e, cpt) {
         e.killShots();
      }, self);
      self.enemies.removeAll(true);

      self.text_middle.text = "Niveau bonus !";
      self.text_level.text = "YAY !";
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

   givePoints: function(amount) { //GROS WIP
      var self = this;
      self.scorePool += amount;
   }
}

