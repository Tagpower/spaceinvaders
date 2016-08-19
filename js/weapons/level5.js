Weapon5B = function (state) {
   Weapon.call(this, state, 500, 1000, 10);
   this.special.setAll('tracking', true);
};

Weapon5B.prototype = Object.create(Weapon.prototype);
Weapon5B.prototype.constructor = Weapon5B;

Weapon5B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-10, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-5 , y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x   , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5 , y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+10, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon5B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 100;

   var timer = this.game.time.create(true);
   timer.repeat(100, 15,
    function(speed, power) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var gx = self.game.rnd.between(-40, 40);
      var gy = self.game.rnd.between(100, 200);

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, -gy);
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, -gy);
      }
   }, this.game, speed, this.power);
   timer.start();
};