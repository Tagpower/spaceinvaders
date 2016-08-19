Weapon3B = function (state) {
   Weapon.call(this, state, 400, 1500, 10);
   this.special.setAll('tracking', true);
};

Weapon3B.prototype = Object.create(Weapon.prototype);
Weapon3B.prototype.constructor = Weapon3B;

Weapon3B.prototype.fire = function (source) {
   
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-5, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x  , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon3B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(100, 10,
    function(speed, power) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var gx = 100;
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, -gx, 0);
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, -gx, 0);
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, 0); 
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, 0); 
      }
   }, this.game, speed, this.power);
   timer.start();
};