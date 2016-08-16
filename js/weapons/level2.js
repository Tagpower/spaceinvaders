Weapon.Weapon2B = function (game) {

   Phaser.Group.call(this, game, game.world, 'Base Weapon Level 2', false, true, Phaser.Physics.ARCADE);
   
   this.weapon1 = new Weapon.Weapon1B(game);
   this.weapon2 = new Weapon.Weapon1B(game);
   this.power = 10;

   this.add(this.weapon1, true);
   this.add(this.weapon2, true);

   return this;

};

Weapon.Weapon2B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon2B.prototype.constructor = Weapon.Weapon2B;

Weapon.Weapon2B.prototype.fire = function (source) {
   this.weapon1.fireFrom(source, -5, 0);
   this.weapon2.fireFrom(source, 5, 0);
};
