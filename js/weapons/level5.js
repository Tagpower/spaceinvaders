Weapon.Weapon5B = function (game) {

   Phaser.Group.call(this, game, game.world, 'Base Weapon Level 5', false, true, Phaser.Physics.ARCADE);
   
   this.nextFire = 0;
   this.bulletSpeed = 500;
   this.fireRate = 1000;
   this.power = 10;

   for (var i = 0; i < 5; i++) {
      this.add(new Bullet(game, 'shot'), true);
   }

   return this;

};

Weapon.Weapon5B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon5B.prototype.constructor = Weapon.Weapon5B;

Weapon.Weapon5B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   try {
      this.getFirstExists(false).fire(x-10, y+7, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x-5 , y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x   , y  , 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+5 , y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+10, y+7, 0, this.bulletSpeed, 0, 0);
   } catch(err) {
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.add(new Bullet(game, 'shot'), true);
      this.getFirstExists(false).fire(x-10, y+7, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x-5 , y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x   , y  , 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+5 , y+5, 0, this.bulletSpeed, 0, 0);
      this.getFirstExists(false).fire(x+10, y+7, 0, this.bulletSpeed, 0, 0);
   }

   this.nextFire = this.game.time.time + this.fireRate;
};
