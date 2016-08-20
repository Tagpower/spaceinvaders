var BonusShip = function (state, x, y, key, frame, value, health, framesAnim, timeAnim) {
   Phaser.Sprite.call(this, state.game, x, y, key, frame);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.value = value;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);    
   this.body.immovable = true;
   this.state = state;
   this.health = health;
   this.checkWorldBounds = true;
   this.outOfBoundsKill = true;

   this.animations.add('move', framesAnim, timeAnim, true);
   this.animations.play('move');

   if (Math.random() < 0.5) {
      this.body.velocity.x = 90; 
   } else {
      this.x = this.state.game.world.width + 7;
      this.body.velocity.x = -90;
   }

   this.events.onKilled.add(this.dropItem, this);
}

BonusShip.prototype = Object.create(Phaser.Sprite.prototype);
BonusShip.prototype.constructor = BonusShip;

BonusShip.prototype.dropItem = function(obj) {
   var x = obj.body.center.x;
   var y = obj.body.center.y;

   obj.state.score += obj.value;
   if (!obj.state.mute) {
      obj.state.killenemy_sd.play();
   }

   //randomly create a bonus
   var random = Math.random() * 110;
   if (random <= 10) {
      new Powerup(obj.state, x, y, 'powerups', 12, PowerupColl.extraLife);
   }
   if (random > 10 && random <= 25) {
      new Powerup(obj.state, x, y, 'powerups', 36, PowerupColl.power, true, [36, 37, 38, 39], 18, true);
   }
   if (random > 25 && random <= 40) {
      new Powerup(obj.state, x, y, 'powerups', 4, PowerupColl.cooldown, true, [4, 5, 6, 7], 18, true);
   }
   if (random > 40 && random <= 55) {
      new Powerup(obj.state, x, y, 'powerups', 24, PowerupColl.special, true, [24,25,26,27], 18, true);
   }           
   if (random > 55 && random <= 70) {
      new Powerup(obj.state, x, y, 'powerups', 8, PowerupColl.freeze, true, [8,9,10,11], 18, true);
   }
   if (random > 70 && random <= 80) {
      new Powerup(obj.state, x, y, 'powerups', 28, PowerupColl.warp, true, [28,29,30,31], 18, true);
   }           
   if (random > 80 && random <= 90) {
      new Powerup(obj.state, x, y, 'powerups', 32, PowerupColl.kill, true, [32,33,34,35], 18, true);
   }           
   if (random > 90 && random <= 100) {
      new Powerup(obj.state, x, y, 'powerups', 16, PowerupColl.orange, true, [16,17,18,19], 18, true);
   }
   if (random > 100 && random <= 110) {
      new Powerup(obj.state, x, y, 'powerups', 40, PowerupColl.bonusLevel, true, [40,41,42,43,44,45,46,47,48,49,50,51,52,53], 18, true);
   }
}