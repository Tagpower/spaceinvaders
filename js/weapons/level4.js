Weapon.Weapon4B = function (game) {

   Phaser.Group.call(this, game, game.world, 'Base Weapon Level 4', false, true, Phaser.Physics.ARCADE);
   
   this.weapon1 = new Weapon.Weapon1B(game);
   this.weapon2 = new Weapon.Weapon1B(game);
   this.weapon3 = new Weapon.Weapon1B(game);
   this.weapon4 = new Weapon.Weapon1B(game);

   this.add(this.weapon1, true);
   this.add(this.weapon2, true);
   this.add(this.weapon3, true);
   this.add(this.weapon4, true);

   this.power = 10;

   return this;

};

Weapon.Weapon4B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon4B.prototype.constructor = Weapon.Weapon4B;

Weapon.Weapon4B.prototype.fire = function (source) {
   this.weapon1.fireFrom(source, -10, 5);
   this.weapon2.fireFrom(source, -5, 0);
   this.weapon3.fireFrom(source, 5, 0);
   this.weapon4.fireFrom(source, 10, 5);
};
