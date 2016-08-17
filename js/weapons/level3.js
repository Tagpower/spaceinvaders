Weapon.Weapon3B = function (state) {

   Phaser.Group.call(this, state.game, state.game.world, 'Base Weapon Level 1', false, true, Phaser.Physics.ARCADE);

   this.nextFire = 0;
   this.bulletSpeed = 500;
   this.fireRate = 1000;
   this.power = 10;
   this.state = state;

   for (var i = 0; i < 5; i++) {
      this.add(new Bullet(this.game, 'shot'), true);
   }

   this.special = this.game.add.group(this.game.world, 'Special Weapon Level 1', false, true, Phaser.Physics.ARCADE);

   for (i = 0; i < 40; i++) {
      this.special.add(new Bullet(this.game, 'shot'), true);
   }

   this.special.setAll('tracking', true);

   return this;

};

Weapon.Weapon3B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon3B.prototype.constructor = Weapon.Weapon3B;

Weapon.Weapon3B.prototype.update = function() {
   this.game.physics.arcade.collide(this.special, this.state.enemies, this.collide, false, this);
}

Weapon.Weapon3B.prototype.collide = function(shot, enemy) {
   this.state.hitEnemy(shot, enemy);
}

Weapon.Weapon3B.prototype.fire = function (source) {
   
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   try {
      this.getFirstExists(false).fire(x-5, y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x  , y  , 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+5, y+5, 0, this.bulletSpeed, 0, 0);
   } catch(err) {
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.getFirstExists(false).fire(x-5, y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x  , y  , 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+5, y+5, 0, this.bulletSpeed, 0, 0);
   }

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon.Weapon3B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(100, 10,
    function(speed) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var gx = 100;
      self.special.getFirstExists(false)
      .fire(self.state.player.x, self.state.player.y-20, 0, speed, -gx, 0); 
      self.special.getFirstExists(false)
      .fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0); 
      self.special.getFirstExists(false)
      .fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, 0); 
   }, this.game, speed);
   timer.start();
};