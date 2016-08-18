var Bullet = function (game, key, frame, power) {

   Phaser.Sprite.call(this, game, 0, 0, key, frame);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.anchor.set(0.5);

   this.checkWorldBounds = true;
   this.outOfBoundsKill = true;
   this.exists = false;

   this.tracking = false;
   this.scaleSpeed = 0;

   this.power = power;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

   gx = gx || 0;
   gy = gy || 0;

   this.reset(x, y);
   this.scale.set(1);

   this.game.physics.arcade.velocityFromAngle(angle-90, speed, this.body.velocity);

   //this.angle = angle;

   this.body.gravity.set(gx, gy);

};

Bullet.prototype.update = function () {

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


var Weapon = function(state, bulletSpeed, fireRate, power) {
   Phaser.Group.call(this, state.game, state.game.world, 'Weapon', false, true, Phaser.Physics.ARCADE);

   this.nextFire = 0;
   this.bulletSpeed = bulletSpeed;
   this.fireRate = fireRate;
   this.power = power;
   this.state = state;

   this.special = this.game.add.group(state.game.world, 'Special Weapon', false, true, Phaser.Physics.ARCADE);
}

Weapon.prototype = Object.create(Phaser.Group.prototype);

Weapon.prototype.update = function() {
   this.game.physics.arcade.collide(this.special, this.state.enemies, this.collide, false, this);
}

Weapon.prototype.collide = function(shot, enemy) {
   this.state.hitEnemy(shot, enemy);
}

Weapon.prototype.makeBullet = function(x, y, angle, speed, gx, gy, key, frame) {
   try {
      this.getFirstDead().fire(x, y, angle, speed, gx, gy);
   } catch(err) {
      this.add(new Bullet(game, key, frame, this.power), true);
      this.getFirstExists(false).fire(x, y, angle, speed, gx, gy);
   }
}