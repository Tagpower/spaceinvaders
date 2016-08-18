Weapon1B = function (state) {
   Weapon.call(this, state, 400, 500, 10);
};

Weapon1B.prototype = Object.create(Weapon.prototype);
Weapon1B.prototype.constructor = Weapon1B;

Weapon1B.prototype.fire = function (source) {

   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;

};

Weapon1B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(200, 6,
    function(speed) { 
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0); 
      }
      catch(err) {
         self.special.add(new Bullet(game, 'shot', this.power), true);
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0); 
      }
   }, this.game, speed);
   timer.start();
};