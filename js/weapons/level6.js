Weapon6B = function (state) {
   Weapon.call(this, state, 500, 1000, 10);
   this.special.setAll('tracking', true);
};

Weapon6B.prototype = Object.create(Weapon.prototype);
Weapon6B.prototype.constructor = Weapon6B;

Weapon6B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-15, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-10, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+10, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+15, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon6B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 500;

   var timer = this.game.time.create(true);
   timer.repeat(100, 3,
    function(speed) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      for (var i = -70; i < 70; i+=5) {
         try {
            self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, i, speed, 0, 0);
         } catch(err) {
            self.special.add(new Bullet(game, 'shot'), true);
            self.special.setAll('tracking', true);
            self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, i, speed, 0, 0);
         }
      }
   }, this.game, speed);
   timer.start();
};