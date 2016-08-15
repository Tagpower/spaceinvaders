Weapon.Weapon1B = function (game, group) {

   Phaser.Group.call(this, game, group, 'Base Weapon Level 1', false, true, Phaser.Physics.ARCADE);

   this.nextFire = 0;
   this.bulletSpeed = 600;
   this.fireRate = 1000;
   this.power = 10;

   for (var i = 0; i < 64; i++)
   {
      this.add(new Bullet(game, 'shot'), true);
   }

   return this;

};

Weapon.Weapon1B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon1B.prototype.constructor = Weapon.Weapon1B;

Weapon.Weapon1B.prototype.fire = function (source) {

   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

   this.nextFire = this.game.time.time + this.fireRate;

};

Weapon.Weapon1B.prototype.fireFrom = function (source, dx, dy) {

   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x + dx;
   var y = source.y + dy;

   this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

   this.nextFire = this.game.time.time + this.fireRate;

};
