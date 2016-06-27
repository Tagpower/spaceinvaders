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
      self.shots = null;
      self.special_shots = null;
      self.enemy_shots = null;
      self.bonusships = null;
      self.explosions = null;
      self.shield = null;

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
      self.shield_time = 0;
      self.shots_cooldown = 0;
      self.special_cooldown = 0;
      self.special_available = 1;
      self.cooldown_reduction = config.cooldown_reduction;
      self.init_x = config.init_x;
      self.init_y = config.init_y;
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
      self.shots = self.game.add.group();
      self.shots.enableBody = true;

      self.special_shots = self.game.add.group();
      self.special_shots.enableBody = true;

      self.enemy_shots = self.game.add.group();
      self.enemy_shots.enableBody = true;

      self.explosions = self.game.add.group();
      self.explosions.enableBody = true;

      self.enemies = self.game.add.group();
      self.enemies.enableBody = true;

      self.bonusships = self.game.add.group();
      self.bonusships.enableBody = true;

      self.items = self.game.add.group();

      self.shield = self.game.add.sprite(0, 0, 'shield');

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
      self.text_middle = self.game.add.text(200, self.game.world.height/2, '', {font: '32px Minecraftia', fill: '#ffffff'});
      self.text_middle.fixedToCamera = true;
      self.text_pause = self.game.add.text(200, self.game.world.height/1.5, 'PAUSE', {font: '32px Minecraftia', fill: '#ffffff'});
      self.text_pause.fixedToCamera = true;
      self.text_pause.alpha = 0;
      self.text_score = self.game.add.text(16, 5, '', {font: '16px Minecraftia', fill: '#00aaff'});
      self.text_score.fixedToCamera = true;
      self.text_level = self.game.add.text(200, game.world.height/2 + 40, '', {font: '16px Minecraftia', fill: '#00aaff'});
      self.text_level.fixedToCamera = true;

      self.music = self.game.add.audio('ambient');
      self.music.loop = true;
      self.music.volume = 1;
      self.music_bonus = self.game.add.audio('bonus_loop');
      self.music_bonus.loop = true;

      if (!self.mute) {
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
      }
      else {
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
      self.game.physics.arcade.collide(self.shots, self.enemies, self.hitEnemy, null, self);
      self.game.physics.arcade.collide(self.special_shots, self.enemies, self.hitEnemy, false, self); 
      self.game.physics.arcade.collide(self.explosions, self.enemies, self.hitEnemy, null, self);
      self.game.physics.arcade.collide(self.shots, self.bonusships, self.hitBonusShip, null, self);
      //game.physics.arcade.collide(player, enemies, levelFailed, null, self)
      self.game.physics.arcade.collide(self.player, self.enemies, self.playerHit, function(){return (!self.lostAlife && self.shield_time == 0);}, self);
      self.game.physics.arcade.collide(self.player, self.enemy_shots, self.playerHit, null, self);
      self.game.physics.arcade.collide(self.player, self.items, self.collectItem, null, self);



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
            if (self.shots_cooldown == 0) {
               switch (self.power) { //Number of shots depends on the ship's power
                  case 7:
                     self.createShot(self.player.body.center.x-17, self.player.body.y, -30, -270);
                     self.createShot(self.player.body.center.x+13, self.player.body.y, 30, -270);
                  case 5:
                     self.createShot(self.player.body.center.x-12, self.player.body.y, -20, -280);
                     self.createShot(self.player.body.center.x+8, self.player.body.y, 20, -280);
                  case 3:
                     self.createShot(self.player.body.center.x-7, self.player.body.y, -10, -290);
                     self.createShot(self.player.body.center.x+3, self.player.body.y, 10, -290);
                  case 1:
                  default:
                     self.createShot(self.player.body.center.x-2, self.player.body.y, 0, -300);
                     //createShot(player.body.center.x-2, player.body.y, Math.random()*60-30, -300); //Another weapon ?
                     break;
                  case 6:
                     self.createShot(self.player.body.center.x-16, self.player.body.y, -16, -280);
                     self.createShot(self.player.body.center.x+12, self.player.body.y, 16, -280);                        
                  case 4:
                     self.createShot(self.player.body.center.x-11, self.player.body.y, -8, -290);
                     self.createShot(self.player.body.center.x+7, self.player.body.y, 8, -290);
                  case 2:
                     self.createShot(self.player.body.center.x-6, self.player.body.y, 0, -300);
                     self.createShot(self.player.body.center.x+2, self.player.body.y, 0, -300);
                     break;
               }
               self.shots_cooldown = (DEFAULT_FIRE_COOLDOWN + 10*self.power) * (1-self.cooldown_reduction/(MAX_CDR*2.0));
            }
         }

         //Fire super special shots 
         if (self.special_btn.isDown) {
            if (self.special_available > 0 && self.special_cooldown == 0) {
               if (self.power == MAX_POWER) {
                  self.createSpecialShot(self.player.body.center.x-2, self.player.body.y, -10, -300);
                  self.createSpecialShot(self.player.body.center.x-2, self.player.body.y, 10, -300)
               } else {
                  self.createSpecialShot(self.player.body.center.x-2, self.player.body.y, 0, -300);
               }
               self.special_available--;
            }
         }		

         if (self.shield_time > 0) {
            self.shield_time--;
         } else {
            self.shield_time = 0;
         }
         self.shield.alpha = Math.min(self.shield_time/60.0, 0.75); //Fade the shield sprite with time


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
         console.log("DEAD ?");
         self.player.body.velocity.x = 0;
         self.player.animations.play('dead');
         //enemies.setAll('body.velocity.x', 0);
         if (self.lives == 0) {
            if (self.restart_btn.isDown) {
               self.restart(0);
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

         //Make the enemies fire
         self.random = Math.random();
         if (self.random < enemy.fireProba) {
            switch (enemy.type) {
               default:
               case 1:
                  self.enemyFire(enemy, 0, 100);
                  break;
               case 2:
                  self.enemyFire(enemy, -25, 100);
                  self.enemyFire(enemy, 0, 100);
                  self.enemyFire(enemy, 25, 100);
                  break;
               case 3:
                  self.enemyFire(enemy, 0, 300);
                  break; 
               case 7:
                  self.enemyFire(enemy, 0, 1);
                  break;
               case 9:
                  self.enemyFire(enemy, Math.random()*200-100, Math.random()*200+50);
                  break;
               case 11: //OH GOD
                  self.enemyFire(enemy, 0, 600);
                  break; 
            }
         }
      });

      //When the level is beaten
      console.log("is beaten ?");
      if (self.enemies.countLiving() == 0 && self.enemy_shots.countLiving() == 0 && self.current_level < levels.length && !self.wait_next_level) {
         self.bonusships.forEachAlive(function(bship) {
            if (bship.body.velocity.x == 0) {
               bship.kill();
               console.log("bonus ship en attente killé"); //FIXME
            }
         });
         console.log('level ' + (self.current_level+1) + ' beaten');
         self.shots.removeAll();

         //timer.start();
         //console.log(timer.seconds);
         if (self.in_bonus_level) {
            self.current_bonus_level++;
            self.in_bonus_level = false;
            self.just_end_bonus = true;
            self.music_bonus.stop();
            self.music.play();
         }
         self.loadLevel(++self.current_level);
      }

      //Kill shots and items when touching bounds
      self.shots.forEachAlive(function(proj) {
         if (proj.body.y < -10 || proj.body.x < -4 || proj.body.x > self.game.world.width + 4) {
            proj.kill();
         }
      });

      self.enemy_shots.forEachAlive(function(proj) {
         if (proj.body.y > self.game.world.height+8 || proj.body.x < -4 || proj.body.x > self.game.world.width + 4) {
            proj.kill();
         }
      });

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
   },
   // }}}
   // {{{ LOADLEVEL
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
   // {{{ CREATEENEMIES
   createEnemies: function(array) {
      var self = this;
      self.createEnemiesAbs(array, 10, 30);
   },
   // }}}
   // {{{ CREATEENEMIESABS
   createEnemiesAbs: function(array, x, y) {
      var self = this;
      for (var i = 0; i < array.length; i++) {
         for (var j = 0; j < array[i].length; j++) {
            if (array[i][j] > 0) {
               var enemy = self.game.add.sprite(x+j*25, y+i*25, 'enemy');
               self.game.physics.arcade.enable(enemy);
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
               self.enemies.add(enemy);
            }
         }
      }   
   },
   // }}}
   // {{{ ENEMYFIRE
   enemyFire: function(enemy,velx,vely) {
      var self = this;
      // TODO sprite optimization
      var enemyshot = self.enemy_shots.getFirstDead();
      if (enemyshot === null || enemyshot === undefined) {
         enemyshot = self.game.add.sprite(enemy.body.center.x, enemy.body.center.y, 'enemyshots', enemy.type-1);
         self.enemy_shots.add(enemyshot);
      }
      else {
         enemyshot.revive();
         enemyshot.frame = enemy.type-1;
         enemyshot.reset(enemy.body.center.x, enemy.body.center.y);
      }
      enemyshot.checkWorldBounds = true;
      enemyshot.outOfBoundsKill = true;
      self.game.physics.arcade.enable(enemyshot);
      enemyshot.body.velocity.x = velx;
      enemyshot.body.velocity.y = vely;
      enemyshot.body.mass = 0;
      enemyshot.type = enemy.type;
      if (!self.mute) {
         self.enemyfire_sd.play();
      }
      if (enemy.type == 7) {
         enemyshot.body.gravity.y = 250;
         if (enemy.body.x <= self.player.body.x) {
            enemyshot.body.gravity.x = 10-(enemy.body.x - self.player.body.x)/10;
         } else {
            enemyshot.body.gravity.x = -10-(enemy.body.x - self.player.body.x)/10;
         }
      }
   },
   // }}}
   // {{{ CREATESHOT
   createShot: function(x,y,velx,vely) {
      var self = this;
      var shot = self.shots.getFirstDead();
      if (shot === null || shot === undefined) {
         shot = self.game.add.sprite(x,y, "shot");
         self.shots.add(shot);
      }
      else {
         shot.revive();
         shot.reset(x,y);
      }
      shot.checkWorldBounds = true;
      shot.outOfBoundsKill = true;
      self.game.physics.arcade.enable(shot);
      shot.body.velocity.x = velx;
      shot.body.velocity.y = vely;
      if (!self.mute) {
         self.fire_sd.play();
      }
   },
   // }}}
   // {{{ HITENEMY
   hitEnemy: function(shot, enemy) {
      var self = this;
      if (shot.key != 'explosion')  {
         shot.kill();
      }
      if (!enemy.touched) {
         if (enemy.health == 1) {
            enemy.touched = true;
            enemy.animations.stop();
            enemy.body.enable = false;
            self.score += enemy.value;
            if (!self.mute) {
               self.killenemy_sd.play();
            }
            enemy.kill();
            self.speed += self.speedup;
            self.speedup += self.accel;
            if (enemy.type == 6) { //If the enemy is type 6 (yellow), kamikaze attack !
               self.enemyFire(enemy, -80, 250);
               self.enemyFire(enemy, -40, 250);
               self.enemyFire(enemy, 0, 250);
               self.enemyFire(enemy, 40, 250);
               self.enemyFire(enemy, 80, 250);
            } else if (enemy.type == 10) {
               self.createExplosion(enemy.body.center.x, enemy.body.center.y);
            }

            //randomly create a bonus
            var random = Math.random();
            if (random <= POWERUP_CHANCE) {
               //Bonus roulette
               var roulette = Math.random()*100;
               if (roulette <= 20) {
                  self.createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_power');
               }
               if (roulette > 20 && roulette <= 40) {
                  self.createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_cooldown');
               }
               if (roulette > 40 && roulette <= 60) {
                  self.createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_special');
               }
               if (roulette > 60 && roulette <= 75) {
                  self.createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_clear');
               }
               if (roulette > 75 && roulette <= 85) {
                  self.createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_shield');
               }
               if (roulette > 85 && roulette <= 90) {
                  self.createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_freeze');
               }
               if (roulette > 90 && roulette <= 95) {
                  self.createItem(enemy.body.center.x, enemy.body.center.y, 'powerup_kill');
               }
               if (roulette > 95 && roulette <= 100) {
                  self.createItem(enemy.body.center.x, enemy.body.center.y, 'extralife');
               }
            }
            //*/
         } else {
            enemy.health--;
            if (!self.mute) {
               self.hitenemy_sd.play();
            }
         }
      }
   },
   // }}}
   // {{{ CREATEITEM
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
   createExplosion: function(x,y) {
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
         self.createExplosion(player.body.center.x, player.body.center.y);
         //var tween_death = game.add.tween(player.body).to( { y: game.world.height+10 }, 1000, Phaser.Easing.Linear.None, true);
         
         if (!self.in_bonus_level) {
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
            }
            self.special_available = 1;
            self.lives--;
            if (self.lives > 0) {
               self.timer = self.game.time.create(true);
               self.timer.add(1500, function(){
                  player.body.collideWorldBounds = true;
                  //player.y = 550;
                  console.log("replace player");
                  self.game.add.tween(player.body).to( { y: 550 }, 500, Phaser.Easing.Quadratic.In, true);
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
               self.game.add.tween(player.body).to( { y: 550 }, 500, Phaser.Easing.Quadratic.In, true);
               self.game.add.tween(player.body).to( { x: 300 }, 500, Phaser.Easing.Quadratic.In, true);
               self.lostAlife = false;
               player.alpha = 0.5;
               self.enemies.removeAll();
               self.enemy_shots.removeAll();
               self.shots.removeAll();
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
   collectItem: function(player, item) {
      var self = this;
      if (!self.lostAlife) {         
         switch (item.key) {
            case 'powerup_power': //Raises the player's firepower
               if (self.power < MAX_POWER) {
                  self.power++;
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
                  self.cooldown_reduction += 3;
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
               self.shield_time += 300;
               if (!self.mute) {
                  //shield.play();
               }
               self.score += 500;
               self.text_ship.text = "Bouclier !";
            break;

            case 'powerup_kill': //Tries to shoot all the enemies at once
               self.enemies.forEachAlive(function(enemy) {
                  self.createShot(player.body.center.x, player.body.center.y,  (enemy.x-player.x+enemy.body.velocity.x)*2, (enemy.y-player.y)*2);
               });
               self.score += 750;
               self.text_ship.text = "KILL 'EM ALL !";
            break;

            case 'powerup_clear': //Clears the screen of enemy fire
               var wave = self.game.add.sprite(player.body.center.x, player.body.center.y, 'clear_wave');
               wave.anchor.setTo(0.5, 0.5);
               wave.smoothed = false;
               self.game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
               self.game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
               if (!self.mute) {
                  self.wave_sd.play();
               }
               self.enemy_shots.removeAll();
               self.score += 300;
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
                  e.type = 1;
                  e.animations.add('move', [0, 1], 6, true);
                  e.health = 1;
                  e.fireProba = ENEMY_DEFAULT_FIRE_PROBA;
                  e.value = 100
               });
               self.score += 500;
               if (!self.already_all_orange) {
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

            case 'powerup_warp': //TODO : Warps the enemies back to the top of the screen
               self.enemies.forEachAlive(function(e) {
                  //game.add.tween(e).to( {y: e.x - 300}, 1000, Phaser.Easing.Quadratic.Out, true);
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
   levelFailed: function() {
      var self = this;
      if (!self.lostAlife) {   
         self.playerhit_sd.play();
         self.lostAlife = true;
         self.player.touched = true;
         self.player.body.collideWorldBounds = false;
         self.player.body.velocity.y = 125;
         self.createExplosion(self.player.body.center.x, self.player.body.center.y);
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
               self.enemies.removeAll();
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
         }
      }
   },
   // }}}
   // {{{ CREATESPECIALSHOT
   createSpecialShot: function(x, y, velx, vely) { //V2.0
      var self = this;
      for (var i=0; i < 9+self.power; i++) {
         self.createShot(x, y, velx, vely-i*20);
      }
      if (!self.mute) {
         self.firespecial_sd.play();
      }
      self.special_cooldown = DEFAULT_FIRE_COOLDOWN;
   },
   // }}}
   // {{{ HITBONUSSHIP
   hitBonusShip: function(shot, bship) {
      console.log("HITTED !!!");
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
         var random = 100;//Math.random() * 100;
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
            self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_kill');
         }           
         if (random > 80 && random <= 90) {
            self.createItem(bship.body.center.x, bship.body.center.y, 'powerup_orange');
         }           
         if (random > 90 && random <= 100) {
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
   only: function(n) {
      return [[0,0,n,n,n,n,n,n,0,0],
            [0,n,n,n,n,n,n,n,n,0],
            [n,n,n,n,n,n,n,n,n,n],
            [n,n,n,n,n,n,n,n,n,n]];

   },
   // }}}
   // {{{ RESTART
   restart: function(level) {
      var self = this;
      self.items.removeAll();
      self.shots.removeAll();
      self.special_shots.removeAll();
      self.bonusships.removeAll();
      self.enemies.removeAll();
      self.enemy_shots.removeAll();
      self.player.kill();
      
      var config = {
         score: 0,
         lives: 3,
         shield_time: 0,
         shots_cooldown: 0,
         special_cooldown: 0,
         special_available: 1,
         cooldown_reduction: 0,
         current_level: 0,
         current_bonus_level: 0,
         power: (difficulty == EASY ? 2 : 1)
      }
      self.game.state.start("Game", true, false, config);
   },
   // }}}
   // {{{ LOADNEXTLEVEL
   loadNextLevel: function() {
      var self = this;
      self.items.removeAll();
      self.shots.removeAll();
      self.special_shots.removeAll();
      self.bonusships.removeAll();
      self.enemies.removeAll();
      self.enemy_shots.removeAll();
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
   loadBonusLevel: function() {
      var self = this;
      self.in_bonus_level = true;
      self.music.stop();
      self.music_bonus.play();
      self.items.removeAll();
      self.shots.removeAll();
      self.special_shots.removeAll();
      self.bonusships.removeAll();
      self.enemies.removeAll();
      self.enemy_shots.removeAll();

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
