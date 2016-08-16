Weapon.Weapon6B = function (game) {

   Phaser.Group.call(this, game, game.world, 'Base Weapon Level 6', false, true, Phaser.Physics.ARCADE);
   
   this.nextFire = 0;
   this.bulletSpeed = 500;
   this.fireRate = 1000;
   this.power = 10;

   for (var i = 0; i < 64; i++) {
      this.add(new Bullet(game, 'shot'), true);
   }

   return this;

};

Weapon.Weapon6B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon6B.prototype.constructor = Weapon.Weapon6B;

Weapon.Weapon6B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   this.getFirstExists(false).fire(x-15, y+7, 0, this.bulletSpeed, 0, 0);
   this.getFirstExists(false).fire(x-10, y+5, 0, this.bulletSpeed, 0, 0);
   this.getFirstExists(false).fire(x-5 , y  , 0, this.bulletSpeed, 0, 0);
   this.getFirstExists(false).fire(x+5 , y  , 0, this.bulletSpeed, 0, 0);
   this.getFirstExists(false).fire(x+10, y+5, 0, this.bulletSpeed, 0, 0);
   this.getFirstExists(false).fire(x+15, y+7, 0, this.bulletSpeed, 0, 0);

   this.nextFire = this.game.time.time + this.fireRate;
};
