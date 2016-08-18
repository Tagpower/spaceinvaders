Weapon4B = function (state) {
   Weapon.call(this, state, 500, 1000, 10);
   this.special.setAll('tracking', true);
};

Weapon4B.prototype = Object.create(Weapon.prototype);
Weapon4B.prototype.constructor = Weapon4B;

Weapon4B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-10, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+10, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon4B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(500, 5,
    function(speed) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var angle = 20;

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, -angle, speed, 0, 0); 
      } catch(err) {
         self.special.add(new Bullet(game, 'shot'), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, -angle, speed, 0, 0); 
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, -angle/2, speed, 0, 0); 
      } catch(err) {
         self.special.add(new Bullet(game, 'shot'), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, -angle/2, speed, 0, 0); 
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);  
      } catch(err) {
         self.special.add(new Bullet(game, 'shot'), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);  
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, angle/2, speed, 0, 0);  
      } catch(err) {
         self.special.add(new Bullet(game, 'shot'), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, angle/2, speed, 0, 0);  
      }

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