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