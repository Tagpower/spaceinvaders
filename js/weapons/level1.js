Weapon.Weapon1B = function (game) {

   Phaser.Group.call(this, game, game.world, 'Base Weapon Level 1', false, true, Phaser.Physics.ARCADE);

   this.nextFire = 0;
   this.bulletSpeed = 600;
   this.fireRate = 800;
   this.power = 10;

   return this;

};

Weapon.Weapon1B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon1B.prototype.constructor = Weapon.Weapon1B;

Weapon.Weapon1B.prototype.fire = function (source) {

   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   var bullet = this.getFirstExists(false);
   if (bullet === null || bullet === undefined) {
      bullet = new Bullet(this.game, 'shot');
      this.add(bullet, true);
   }
   bullet.fire(x, y, 0, this.bulletSpeed, 0, 0);

   this.nextFire = this.game.time.time + this.fireRate;

};

Weapon.Weapon1B.prototype.fireFrom = function (source, dx, dy) {

   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x + dx;
   var y = source.y -20 + dy;

   var bullet = this.getFirstExists(false);
   if (bullet === null || bullet === undefined) {
      bullet = new Bullet(this.game, 'shot');
      this.add(bullet, true);
   }
   bullet.fire(x, y, 0, this.bulletSpeed, 0, 0);

   this.nextFire = this.game.time.time + this.fireRate;

};
