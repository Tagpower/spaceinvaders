Weapon.Weapon3B = function (game) {

   Phaser.Group.call(this, game, game.world, 'Base Weapon Level 3', false, true, Phaser.Physics.ARCADE);
   
   this.weapon1 = new Weapon.Weapon1B(game);
   this.weapon2 = new Weapon.Weapon1B(game);
   this.weapon3 = new Weapon.Weapon1B(game);

   this.add(this.weapon1, true);
   this.add(this.weapon2, true);
   this.add(this.weapon3, true);

   this.power = 10;

   return this;

};

Weapon.Weapon3B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon3B.prototype.constructor = Weapon.Weapon3B;

Weapon.Weapon3B.prototype.fire = function (source) {
   this.weapon1.fireFrom(source, -10, 5);
   this.weapon2.fireFrom(source, 0, 0);
   this.weapon3.fireFrom(source, 10, 5);
};
