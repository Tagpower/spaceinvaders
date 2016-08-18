Weapon2B = function (state) {
   Weapon.call(this, state, 500, 1000, 10);
   this.special.setAll('tracking', true);
};

Weapon2B.prototype = Object.create(Weapon.prototype);
Weapon2B.prototype.constructor = Weapon2B;

Weapon2B.prototype.fire = function (source) {

   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-5, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon2B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(100, 10,
    function(speed) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var angle = self.game.rnd.between(-10,10);
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, angle, speed, 0, 0);
      } catch(err) {
         self.special.add(new Bullet(game, 'shot'), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, angle, speed, 0, 0);
      }
   }, this.game, speed);
   timer.start();
};
