Weapon.Weapon7B = function (state) {

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

   for (i = 0; i < 10; i++) {
      var bullet = new Shot(this.game, 'enemyshots', 2, 100);
      bullet.events.onKilled.add(this.specialDeath, this);
      this.special.add(bullet, true);
   }

   return this;

};

Weapon.Weapon7B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon7B.prototype.constructor = Weapon.Weapon7B;

Weapon.Weapon7B.prototype.update = function() {
   this.game.physics.arcade.collide(this.special, this.state.enemies, this.collide, false, this);
}

Weapon.Weapon7B.prototype.collide = function(shot, enemy) {
   this.state.hitEnemy(shot, enemy);
}

Weapon.Weapon7B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

      
   try {
      this.getFirstExists(false).fire(x-15, y+9, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x-10, y+7, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x-5 , y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x   , y  , 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+5 , y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+10, y+7, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+15, y+9, 0, this.bulletSpeed, 0, 0);
   } catch(err) {
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.getFirstExists(false).fire(x-15, y+9, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x-10, y+7, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x-5 , y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x   , y  , 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+5 , y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+10, y+7, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+15, y+9, 0, this.bulletSpeed, 0, 0);
   }

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon.Weapon7B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 500;

   var timer = this.game.time.create(true);
   timer.repeat(300, 5,
    function(speed) {
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
   }, this.game, speed);
   timer.start();
};

Weapon.Weapon7B.prototype.specialDeath = function (obj) {
   console.log("death");
   this.state.createExplosion(obj.x, obj.y, 50);
};