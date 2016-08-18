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
         this.state.createItem(x, y, 'powerup_power');
      }
      else if (roulette > 20 && roulette <= 40) {
         this.state.createItem(x, y, 'powerup_cooldown');
      }
      else if (roulette > 40 && roulette <= 60) {
         this.state.createItem(x, y, 'powerup_special');
      }
      else if (roulette > 60 && roulette <= 75) {
         //this.state.createItem(x, y, 'powerup_clear');
      }
      else if (roulette > 75 && roulette <= 85) {
         this.state.createItem(x, y, 'powerup_shield');
      }
      else if (roulette > 85 && roulette <= 90) {
         this.state.createItem(x, y, 'powerup_freeze');
      }
      else if (roulette > 90 && roulette <= 95) {
         this.state.createItem(x, y, 'powerup_warp');
      }
      else if (roulette > 95 && roulette <= 100) {
         //this.state.createItem(x, y, 'powerup_kill');
      }
      else if (roulette > 100 && roulette <= 105) {
         this.state.createItem(x, y, 'extralife');
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
