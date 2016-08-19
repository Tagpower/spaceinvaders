var Shot = function (game, key, frame, damage) {

   Phaser.Sprite.call(this, game, 0, 0, key, frame);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.anchor.set(0.5);
   this.power = damage;
   this.checkWorldBounds = true;
   this.outOfBoundsKill = true;
   this.exists = false;
   this.alive = false;

   this.tracking = false;
   this.scaleSpeed = 0;

   return this;
   
};

Shot.prototype = Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor = Shot;

Shot.prototype.fire = function (x, y, angle, speed, gx, gy) {

   gx = gx || 0;
   gy = gy || 0;

   this.revive();
   this.reset(x, y);
   this.scale.set(1);

   this.game.physics.arcade.velocityFromAngle(angle-90, speed, this.body.velocity);

   //this.angle = angle;

   this.body.gravity.set(gx, gy);
   this.body.mass = 0;

};

Shot.prototype.update = function () {

   if (this.tracking)
   {
      this.rotation = -Math.atan2(this.body.velocity.x, this.body.velocity.y);
   }

   if (this.scaleSpeed > 0)
   {
      this.scale.x += this.scaleSpeed;
      this.scale.y += this.scaleSpeed;
   }

};

/*/
   ENEMY MOTHER CLASS !!!
//*/
var Enemy = function (state, x, y, key, bulletSpeed, power, type, fireProba, value, health, framesAnim, timeAnim) {
   Phaser.Sprite.call(this, state.game, x, y, key);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = bulletSpeed;
   this.power = power;
   this.type = type;
   this.fireProba = fireProba;
   this.value = value;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);    
   this.body.immovable = true;
   this.state = state;
   this.health = health;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);

   this.animations.add('move', framesAnim, timeAnim, true);
   this.animations.play('move');

   this.events.onKilled.add(this.dropItem, this);
   this.events.onKilled.add(this.enemyDeath, this);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.livingShots = function() {
   return this.shots.countLiving();
}

Enemy.prototype.killShots = function() {
   this.shots.removeAll(true);
}

Enemy.prototype.destroy = function() {
   this.shots.removeAll(true);
   this.shots.destroy();
   this.visible = false;
   this.exists = false;
}

Enemy.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (this.alive && Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.prototype.dropItem = function(obj) {
   var x = obj.body.center.x;
   var y = obj.body.center.y;

   //randomly create a bonus
   var random = Math.random();
   if (random <= POWERUP_CHANCE || (this.state.in_bonus_level && random <= POWERUP_CHANCE_IN_BONUS)) { //In a bonus level, bonus are 2x as likely to appear
      //Bonus roulette
      var roulette = Math.random()*105;
      if (roulette <= 20) {
         new Powerup(this.state, x, y, 'powerups', 36, PowerupColl.power, true, [36, 37, 38, 39], 18, true);
      }
      else if (roulette > 20 && roulette <= 40) {
         new Powerup(this.state, x, y, 'powerups', 4, PowerupColl.cooldown, true, [4, 5, 6, 7], 18, true);
      }
      else if (roulette > 40 && roulette <= 60) {
         new Powerup(this.state, x, y, 'powerups', 24, PowerupColl.special, true, [24,25,26,27], 18, true);
      }
      else if (roulette > 60 && roulette <= 75) {
         new Powerup(this.state, x, y, 'powerups', 0, PowerupColl.clear, true, [0,1,2,3], 18, true);
      }
      else if (roulette > 75 && roulette <= 85) {
         new Powerup(this.state, x, y, 'powerups', 20, PowerupColl.shield, true, [20, 21, 22, 23], 18, true);
      }
      else if (roulette > 85 && roulette <= 90) {
         new Powerup(this.state, x, y, 'powerups', 8, PowerupColl.freeze, true, [8,9,10,11], 18, true);
      }
      else if (roulette > 90 && roulette <= 95) {
         new Powerup(this.state, x, y, 'powerups', 28, PowerupColl.warp, true, [28,29,30,31], 18, true);
      }
      else if (roulette > 95 && roulette <= 100) {
         new Powerup(this.state, x, y, 'powerups', 32, PowerupColl.kill, true, [32,33,34,35], 18, true);
      }
      else if (roulette > 100 && roulette <= 105) {
         new Powerup(this.state, x, y, 'powerups', 12, PowerupColl.extraLife);
      }
   }
}

Enemy.prototype.enemyDeath = function(obj) {
   this.state.speed += this.state.speedup;
   this.state.speedup += this.state.accel;
   this.state.score += this.value;
   if (!this.state.mute) {
      this.state.killenemy_sd.play();
   }
}
