var invaders = function(game) { 
}

invaders.prototype = {
   init: function(difficulty, level, power, firerate, isBonus) {
      console.log("Running the game...");
      this.isBonus = isBonus;

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
      this.current_level = level;
      this.current_bonus_level = level;
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
      console.log("\tCreating player...");
      this.createPlayer();
      console.log("\t-*- Player created -*-");
      this.game.camera.follow(this.player);

      //All inputs
      this.cursors = this.game.input.keyboard.createCursorKeys();
      this.fire_btn = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.special_btn = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
      this.mute_btn = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
      this.pause_btn = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
      this.restart_btn = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

      //mute_btn.onUp.add(muteGame, this);
      this.pause_btn.onDown.add(this.pauseGame, this);

      //Ingame Text
      this.text_middle = this.game.add.text(200, this.game.world.height/2, '', {font: '32px Minecraftia', fill: '#ffffff'});
      this.text_middle.fixedToCamera = true;
      this.text_pause = this.game.add.text(200, this.game.world.height/1.5, 'PAUSE', {font: '32px Minecraftia', fill: '#ffffff'});
      this.text_pause.fixedToCamera = true;
      this.text_pause.alpha = 0;
      this.text_score = this.game.add.text(16, 5, '', {font: '16px Minecraftia', fill: '#00aaff'});
      this.text_score.fixedToCamera = true;
      this.text_level = this.game.add.text(200, game.world.height/2 + 40, '', {font: '16px Minecraftia', fill: '#00aaff'});
      this.text_level.fixedToCamera = true;

      this.music = this.game.add.audio('ambient');
      this.music.loop = true;
      this.music_bonus = this.game.add.audio('bonus_loop');
      this.music_bonus.loop = true;

      if (!this.mute) {
         this.music.play();
      }

      //Create all sounds
      this.pickup_sd = this.game.add.audio('pickup');
      this.hellyeah_sd = this.game.add.audio('hellyeah');
      this.playerhit_sd = this.game.add.audio('explode');
      this.hitenemy_sd = this.game.add.audio('hitenemy');
      this.killenemy_sd = this.game.add.audio('killenemy');
      this.fire_sd = this.game.add.audio('fire');
      this.firespecial_sd = this.game.add.audio('firespecial');
      this.enemyfire_sd = this.game.add.audio('enemyfire');
      this.wave_sd = this.game.add.audio('wave');
      this.intro_sd = this.game.add.audio('intro');
      this.win_sd = this.game.add.audio('win');
      this.over_sd = this.game.add.audio('over');

      this.text_ship = this.game.add.text(this.player.body.x - 20, this.player.body.y-20, '', {font: '16px Minecraftia', fill: '#44ff44'});
      this.text_ship.anchor.setTo(0.5, 0.5);
      this.text_ship.alpha = 0;

      this.speed = START_SPEED;
      this.speedup = SPEEDUP_INIT;
      this.accel = SPEEDUP_ACCEL;

      if (!this.isBonus){
         console.log("\tLoading level " + this.current_level + " ...");
         this.loadLevel(this.current_level);
         console.log("\t-*- Level loaded -*-");
      }
      else {
         console.log("Loading bonus level " + this.current_bonus_level + " ...");
         this.loadLevel(this.current_bonus_level);
         console.log("-*- Bonus level loaded -*-");
      }
      this.enemies.setAll('body.velocity.x', this.speed); 
   },
   update: function() {
      var self = this;
      if (currentDifficulty != difficulty) {
         currentDifficulty = difficulty;
         this.restart(this.current_level);
      }
      //Check collisions for everything
      this.game.physics.arcade.collide(this.shots, this.enemies, this.hitEnemy, null, this);
      this.game.physics.arcade.collide(this.special_shots, this.enemies, this.hitEnemy, false, this); 
      this.game.physics.arcade.collide(this.explosions, this.enemies, this.hitEnemy, null, this);
      this.game.physics.arcade.collide(this.shots, this.bonusships, this.hitBonusShip, null, this);
      //game.physics.arcade.collide(player, enemies, levelFailed, null, this);
      this.game.physics.arcade.collide(this.player, this.enemies, this.playerHit, function(){return (!this.lostAlife && this.shield_time == 0);}, this);
      this.game.physics.arcade.collide(this.player, this.enemy_shots, this.playerHit, null, this);
      this.game.physics.arcade.collide(this.player, this.items, this.collectItem, null, this);



      this.text_score.text = 'Niveau ' + (this.current_level+1) + '    Score: ' + this.score + '   Vies: ' + this.lives + '\nPuissance: ' + this.power + ' Vitesse de tir: '+ this.cooldown_reduction +'    Tir spécial: ' + this.special_available;
      //background.tilePosition.y += current_level/5 + 1;
      this.background.tilePosition.y += 1 + (14*this.in_bonus_level); //FIXME

      //All controls are disabled when the player dies
      if (!this.lostAlife) {
         //Mute button
         if (this.mute_btn.isDown) {
            if (this.mute_wait == 0) {
               this.muteGame();
            }
         };

         //Control the player
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            //if (!player.touched) {
                  //player.body.velocity.y = 0; 
            //};
         if (this.cursors.up.isDown && difficulty < OHGOD) {
            this.player.body.velocity.y = -PLAYER_SPEED;
            this.player.body.velocity.x = 0; 
            //player.animations.play('left');
         } else if (this.cursors.down.isDown  && difficulty < OHGOD) {
            this.player.body.velocity.y = PLAYER_SPEED;
            this.player.body.velocity.x = 0; 
            //player.animations.play('right');
         }

         if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -PLAYER_SPEED;
            //player.body.velocity.y = 0; 
            this.player.animations.play('left');
         } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = PLAYER_SPEED;
            //player.body.velocity.y = 0; 
            this.player.animations.play('right');
         } else if (!this.lostAlife) {
               this.player.animations.play('idle');
         }

          //Fire shots
         if (this.fire_btn.isDown) {
            if (this.shots_cooldown == 0) {
               switch (this.power) { //Number of shots depends on the ship's power
                  case 7:
                     this.createShot(this.player.body.center.x-17, this.player.body.y, -30, -270);
                     this.createShot(this.player.body.center.x+13, this.player.body.y, 30, -270);
                  case 5:
                     this.createShot(this.player.body.center.x-12, this.player.body.y, -20, -280);
                     this.createShot(this.player.body.center.x+8, this.player.body.y, 20, -280);
                  case 3:
                     this.createShot(this.player.body.center.x-7, this.player.body.y, -10, -290);
                     this.createShot(this.player.body.center.x+3, this.player.body.y, 10, -290);
                  case 1:
                  default:
                     this.createShot(this.player.body.center.x-2, this.player.body.y, 0, -300);
                     //createShot(player.body.center.x-2, player.body.y, Math.random()*60-30, -300); //Another weapon ?
                     break;
                  case 6:
                     this.createShot(this.player.body.center.x-16, this.player.body.y, -16, -280);
                     this.createShot(this.player.body.center.x+12, this.player.body.y, 16, -280);                        
                  case 4:
                     this.createShot(this.player.body.center.x-11, this.player.body.y, -8, -290);
                     this.createShot(this.player.body.center.x+7, this.player.body.y, 8, -290);
                  case 2:
                     this.createShot(this.player.body.center.x-6, this.player.body.y, 0, -300);
                     this.createShot(this.player.body.center.x+2, this.player.body.y, 0, -300);
                     break;
               }
               this.shots_cooldown = (DEFAULT_FIRE_COOLDOWN + 10*this.power) * (1-this.cooldown_reduction/(MAX_CDR*2.0));
            }
         }

         //Fire super special shots 
         if (this.special_btn.isDown) {
            if (this.special_available > 0 && this.special_cooldown == 0) {
               if (power == MAX_POWER) {
                  this.createSpecialShot(this.player.body.center.x-2, this.player.body.y, -10, -300);
                  this.createSpecialShot(this.player.body.center.x-2, this.player.body.y, 10, -300)
               } else {
                  this.createSpecialShot(this.player.body.center.x-2, this.player.body.y, 0, -300);
               }
               this.special_available--;
            }
         }		

         if (this.shield_time > 0) {
            this.shield_time--;
         } else {
            this.shield_time = 0;
         }
         this.shield.alpha = Math.min(this.shield_time/60.0, 0.75); //Fade the shield sprite with time


         if (this.shots_cooldown > 0) {
            this.shots_cooldown--;
         } else {
            this.shots_cooldown = 0;
         }

         if (this.special_cooldown > 0) {
               this.special_cooldown--;
         } else {
               this.special_cooldown = 0;
         }


      } else {
      //When the player dies
            this.player.body.velocity.x = 0;
            this.player.animations.play('dead');
            //enemies.setAll('body.velocity.x', 0);
            if (this.lives == 0) {
               if (this.restart_btn.isDown) {
                  this.restart(0);
               }
            }
      };

      if (this.mute_wait > 0) {
            this.mute_wait--;
      } else {
            this.mute_wait = 0;
      }

      //Move the enemies
      this.enemies.forEachAlive(function(enemy){
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
      if (this.enemies.countLiving() == 0 && this.enemy_shots.countLiving() == 0 && this.current_level < levels.length && !this.wait_next_level) {
         this.bonusships.forEachAlive(function(bship) {
            if (bship.body.velocity.x == 0) {
               bship.kill();
               console.log("bonus ship en attente killé"); //FIXME
            }
         });
         console.log('level ' + (current_level+1) + ' beaten');
         this.shots.removeAll();
         
         //timer.start();
         //console.log(timer.seconds);
         if (this.in_bonus_level) {
            this.current_bonus_level++;
            this.in_bonus_level = false;
            this.music_bonus.stop();
            this.music.play();
         }
         //loadLevel(++current_level);
         // TODO restart the state with the next level

      }

      //Kill shots and items when touching bounds
      this.shots.forEachAlive(function(proj) {
         if (proj.body.y < -10 || proj.body.x < -4 || proj.body.x > self.game.world.width + 4) {
               proj.kill();
         }
      });

      this.enemy_shots.forEachAlive(function(proj) {
         if (proj.body.y > self.game.world.height+8 || proj.body.x < -4 || proj.body.x > self.game.world.width + 4) {
               proj.kill();
         }
      });

      this.explosions.forEachAlive(function(expl) {
         //game.debug.body(expl);
         if (expl.alpha < 0.1) {
            expl.kill();
         }
      });

      this.bonusships.forEachAlive(function(bship) {
         if (bship.x > self.game.world.height + bship.body.width*2 || bship.x < -bship.body.width*2) {
               bship.kill();
         }
      });
   },
   createPlayer: function() {
      this.player = this.game.add.sprite(300,550,'ship');
      this.game.physics.arcade.enable(this.player);

      this.player.body.collideWorldBounds = true;
      this.player.body.immovable = false;
      this.lostAlife = false;
      this.touched = false;
      
      this.player.anchor.setTo(0.5,0.5);

      this.player.animations.add('idle', [0,1],6,true);
      this.player.animations.add('left', [2,3],6,true);
      this.player.animations.add('right', [4,5],6,true);
      this.player.animations.add('dead', [6],6,true);
   },
   loadLevel: function(lvl) {
      if(lvl >= levels.length) {
         this.win_sd.play();
         this.game.add.tween(this.text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
         this.game.add.tween(this.text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);

         this.text_middle.text = "Niveaux tous finis !\n(pour l'instant)";
         this.text_level.text = "Merci d'avoir essayé !" ;
      } else {
         this.text_middle.text = "Niveau " + (lvl+1);
         this.text_level.text = level_names_fr[lvl];
         //text_level.text = level_names_en[lvl];
         this.text_middle.alpha = 0;
         this.text_level.alpha = 0;

         this.game.add.tween(this.text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
         this.game.add.tween(this.text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);


         if(speed_values[lvl]) {
            this.speed = speed_values[lvl][0]*(1+difficulty*0.15);
            this.speedup = speed_values[lvl][1]*(1+difficulty*0.15);
            this.accel = speed_values[lvl][2]/**(1+difficulty*0.2)*/;
         } else {
            this.speed = START_SPEED;
            this.speedup = SPEEDUP_INIT;
            this.accel = SPEEDUP_ACCEL;
         }

         this.wait_next_level = true;
         this.timer = game.time.create(true);
         this.timer.add(3000, function(){
            this.game.add.tween(this.text_middle).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
            this.game.add.tween(this.text_level).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
            console.log("\tCreating enemies...");
            this.createEnemies(levels[lvl]); 
            console.log("\t-*- Enemies created -*-");
            this.wait_next_level = false;
         }, this);
         this.timer.start();

         //Set a delay for the bonus ship to come (20 to 40 secs)
         //createEnemies(levels[lvl]); 
         var delayForBonus = Math.random()*20*1000 + 20000;
         this.bonusShip(delayForBonus);
      }

   },
   pauseGame: function() {
      if (this.lives > 0) {
         if (!this.game.paused) {
            console.log("\tGame paused !");
            this.text_pause.alpha = 1;
            this.game.paused = true;
            this.music.pause();
         } else {
            console.log("\tGame resumed !");
            this.text_pause.alpha = 0;
            this.game.paused = false;
            if (!this.mute) {
               this.music.resume();
            }
         }
      }   
   },
   bonusShip: function(delay) {
      console.log('\tbonus ship dans %.2f s',delay/1000);
      this.timer = this.game.time.create(true);
      this.timer.add(delay, function(){
         var bship = this.game.add.sprite(-32, 15, 'bonusship', 0); 
    
         bship.animations.add('move', [0,1,2,3], 12, true);
         this.bonusships.add(bship); 
         bship.animations.play('move');
         bship.value = 1000;  

         this.game.physics.arcade.enable(bship);
         if (Math.random() < 0.5) {
            bship.body.velocity.x = 90; 
         } else {
            bship.x = this.game.world.width + 10;
            bship.body.velocity.x = -90;
         }
      }, this);
      this.timer.start();
   },
   createEnemies: function(array) {
      this.createEnemiesAbs(array, 10, 30);
   },
   createEnemiesAbs: function(array, x, y) {
      for (var i = 0; i < array.length; i++) {
         for (var j = 0; j < array[i].length; j++) {
            if (array[i][j] > 0) {
               var enemy = this.game.add.sprite(x+j*25, y+i*25, 'enemy');
               this.game.physics.arcade.enable(enemy);
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
               this.enemies.add(enemy);
            }
         }
      }   
   },
   enemyFire: function(enemy,velx,vely) {
      // TODO sprite optimization
      var enemyshot = this.game.add.sprite(enemy.body.center.x, enemy.body.center.y, 'enemyshots', enemy.type-1);
      this.game.physics.arcade.enable(enemyshot);
      enemyshot.body.velocity.x = velx;
      enemyshot.body.velocity.y = vely;
      enemyshot.body.mass = 0;
      enemyshot.type = enemy.type;
      if (!this.mute) {
         this.enemyfire_sd.play();
      }
      if (enemy.type == 7) {
         enemyshot.body.gravity.y = 250;
         if (enemy.body.x <= this.player.body.x) {
            enemyshot.body.gravity.x = 10-(enemy.body.x - this.player.body.x)/10;
         } else {
            enemyshot.body.gravity.x = -10-(enemy.body.x - this.player.body.x)/10;
         }
      }
      this.enemy_shots.add(enemyshot);
   }
}
