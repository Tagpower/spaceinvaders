Weapon.Weapon2B = function (game, group) {

   Phaser.Group.call(this, game, group, 'Base Weapon Level 1', false, true, Phaser.Physics.ARCADE);
   
   this.weapon1 = new Weapon.Weapon1B(game, group);
   this.weapon2 = new Weapon.Weapon1B(game, group);
   this.power = 10;

   return this;

};

Weapon.Weapon2B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon2B.prototype.constructor = Weapon.Weapon2B;

Weapon.Weapon2B.prototype.fire = function (source) {
   this.weapon1.fireFrom(source, -5, 0);
   this.weapon2.fireFrom(source, 5, 0);
};
