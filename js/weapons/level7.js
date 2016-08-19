Weapon7B = function (state) {
   Weapon.call(this, state, 400, 3500, 10);
};

Weapon7B.prototype = Object.create(Weapon.prototype);
Weapon7B.prototype.constructor = Weapon7B;

Weapon7B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }
      
   this.makeBullet(x-15, y+9, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-10, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-5 , y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x   , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5 , y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+10, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+15, y+9, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon7B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 500;

   var timer = this.game.time.create(true);
   timer.repeat(300, 5,
    function(speed) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      } catch(err) {
         var bullet = new Shot(self.game, 'enemyshots', 2, 100);
         bullet.events.onKilled.add(self.specialDeath, self);
         self.special.add(bullet, true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      }
   }, this.game, speed);
   timer.start();
};

Weapon7B.prototype.specialDeath = function (obj) {
   console.log("death");
   this.state.createExplosion(obj.x, obj.y, 50);
};