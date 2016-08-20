var PowerupColl = {
   power: function(powerup) {
      if (powerup.state.power < MAX_POWER) {
         powerup.state.power++;
         powerup.state.weapon = powerup.state.weapons[powerup.state.power-1];
         powerup.state.weapon.fireRate = powerup.state.weapon.baseFireRate * (1-powerup.state.cooldown_reduction/100.0);
      }        
      if (powerup.state.power == MAX_POWER) {
         powerup.state.text_ship.text = "PUISSANCE MAX!";
      } else {
         powerup.state.text_ship.text = "Puissance +!";
      }
      powerup.state.score += 300;
      console.log(powerup.state.weapon.baseFireRate);
      console.log(powerup.state.weapon.fireRate);
   },

   cooldown: function(powerup) {
      if (powerup.state.cooldown_reduction < MAX_CDR) {
         powerup.state.cooldown_reduction += Math.min(5, MAX_CDR - powerup.state.cooldown_reduction);
         powerup.state.weapon.fireRate = powerup.state.weapon.baseFireRate * (1-powerup.state.cooldown_reduction/100.0);
      }
      if (powerup.state.cooldown_reduction >= MAX_CDR) {
         powerup.state.cooldown_reduction = MAX_CDR;
         powerup.state.text_ship.text = "VITESSE MAX!";
      } else {
         powerup.state.text_ship.text = "Vitesse tir +!";
      }
      powerup.state.score += 300;
      console.log(powerup.state.weapon.baseFireRate);
      console.log(powerup.state.weapon.fireRate);
   },

   special: function(powerup) {
      powerup.state.special_available++;
      powerup.state.score += 500;
      powerup.state.text_ship.text = "Tir special +1!";
   },

   shield: function(powerup) {
      powerup.state.player.addChild(powerup.state.shield);
      powerup.state.shield.anchor.setTo(0.5, 0.5);
      powerup.state.shield.smoothed = false;
      powerup.state.shield_time += (300 - difficulty * 60);
      if (!powerup.state.mute) {
         //shield.play();
      }
      powerup.state.score += 500;
      powerup.state.text_ship.text = "Bouclier !";
   },

   kill: function(powerup) {
      powerup.state.score += 750;
      powerup.state.text_ship.text = "KILL 'EM ALL !";

      var minX = 0;
      var maxX = powerup.state.game.width;

      var minY = powerup.state.enemies.y;
      var maxY = powerup.state.enemies.y + 200;

      var timer = powerup.state.game.time.create(true);
      timer.repeat(300, 10, function(min_x, max_x, min_y, max_y) {
         var rX = powerup.state.game.rnd.between(min_x, max_x);
         var rY = powerup.state.game.rnd.between(min_y, max_y);

         powerup.state.createExplosion(rX, rY, 100);
      }, powerup.state, minX, maxX, minY, maxY);
      timer.start();
   },

   clear: function(powerup) {
      var wave = powerup.state.game.add.sprite(powerup.state.player.body.center.x, powerup.state.player.body.center.y, 'clear_wave');
      wave.anchor.setTo(0.5, 0.5);
      wave.smoothed = false;
      powerup.state.game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
      powerup.state.game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
      if (!powerup.state.mute) {
         powerup.state.wave_sd.play();
      }

      powerup.state.enemies.forEach(function(e, cpt) {
         e.killShots();
      }, powerup.state);

      powerup.state.score += 300;
      powerup.state.clear_nofiretime += 120; //Prevent enemy fire
      powerup.state.text_ship.text = "Neutralisation !";
   },

   orange: function(powerup) {
      var wave = powerup.state.game.add.sprite(powerup.state.player.body.center.x, powerup.state.player.body.center.y, 'clear_wave');
      wave.tint = 0xff7f00;
      wave.anchor.setTo(0.5, 0.5);
      wave.smoothed = false;
      powerup.state.game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
      powerup.state.game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
      if (!powerup.state.mute) {
         powerup.state.wave_sd.play();
      }
      var already_all_orange = true;
      var tab = [];
      var del = [];
      powerup.state.enemies.forEachAlive(function(e, tab, del){ //Orangify all the enemies
         if (!(e instanceof Orange)) {
            already_all_orange = false;
            tab.push(new Orange(powerup.state, e.x, e.y, 'enemy', ENEMY_DEFAULT_FIRE_PROBA));
            del.push(e);
         }
      }, this, tab, del);

      for (var i = 0; i < del.length; i++)
         powerup.state.enemies.remove(del[i]);

      for (var i = 0; i < tab.length; i++)
         powerup.state.enemies.add(tab[i]);

      powerup.state.score += 500;
      if (!already_all_orange) {
         powerup.state.text_ship.text = "Tous oranges !";
      } else {
         powerup.state.text_ship.text = "Très utile !";
      }
   },

   freeze: function(powerup) {
      var wave = powerup.state.game.add.sprite(powerup.state.player.body.center.x, powerup.state.player.body.center.y, 'clear_wave');
      wave.tint = 0x007fff;
      wave.anchor.setTo(0.5, 0.5);
      wave.smoothed = false;
      powerup.state.game.add.tween(wave).to( { alpha: 0}, 1500, Phaser.Easing.Quintic.Out, true);
      powerup.state.game.add.tween(wave.scale).to( {x: 30, y: 30 }, 1500, Phaser.Easing.Quintic.Out, true);
      if (!powerup.state.mute) {
         powerup.state.wave_sd.play();
      }
      powerup.state.speed = 0;
      powerup.state.score += 400;
      powerup.state.text_ship.text = "Stop !";
   },

   warp: function(powerup) {
      var highest = 1000; 
      powerup.state.enemies.forEachAlive(function(e) {
         if (e.y < highest) {
            highest = e.y;
         }
      });
      powerup.state.enemies.forEachAlive(function(e) {
         game.add.tween(e).to( {y: e.y - (highest-40)}, 1000, Phaser.Easing.Quadratic.Out, true);
      });
      powerup.state.score += 400;
      powerup.state.text_ship.text = "Retour en haut !";
   },

   extraLife: function(powerup) {
      powerup.state.lives++;
      powerup.state.score += 900;
      powerup.state.text_ship.text = "+1 vie !";
   },

   bonusLevel: function(powerup) {
      powerup.state.loadBonusLevel();
      powerup.state.score += 3000;
      powerup.state.text_ship.text = "";
   },
};

var Powerup = function (state, x, y, key, frame, collF, isAnim=false, animFrame=[], animTime=0, animRepeat=false) {

   Phaser.Sprite.call(this, state.game, x, y, key, frame);

   this.state = state;
   this.game.add.existing(this);
   this.game.physics.arcade.enable(this);
   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
   this.anchor.set(0.5);
   this.checkWorldBounds = true;
   this.outOfBoundsKill = true;
   this.body.gravity.y = 100;
   this.body.mass = 0;
   this.collF = collF;

   this.state.items.add(this);

   if (isAnim) {
      this.animations.add('idle', animFrame, animTime, animRepeat);
      this.animations.play('idle');
   }
};

Powerup.prototype = Object.create(Phaser.Sprite.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.update = function() {
   this.game.physics.arcade.collide(this, this.state.player, this.collide, null, this);
}

Powerup.prototype.collide = function(powerup, player) {
   powerup.destroy();
   if (!this.state.lostAlife) {
      this.collF(powerup);
      this.state.text_ship.alpha = 1;
      this.state.text_ship.x = player.body.x;
      this.state.text_ship.y = player.body.y - 10;
      var tween_bonus = this.state.game.add.tween(this.state.text_ship).to( { alpha: 0, y: player.body.y-40 }, 1000, Phaser.Easing.Linear.None, true);

      if (!this.state.mute) {
         this.state.pickup_sd.play();
      }
   }
}