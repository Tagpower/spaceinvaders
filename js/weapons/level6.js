Weapon.Weapon6B = function (game) {

   Phaser.Group.call(this, game, game.world, 'Base Weapon Level 6', false, true, Phaser.Physics.ARCADE);
   
   this.weapon1 = new Weapon.Weapon1B(game);
   this.weapon2 = new Weapon.Weapon1B(game);
   this.weapon3 = new Weapon.Weapon1B(game);
   this.weapon4 = new Weapon.Weapon1B(game);
   this.weapon5 = new Weapon.Weapon1B(game);
   this.weapon6 = new Weapon.Weapon1B(game);

   this.add(this.weapon1, true);
   this.add(this.weapon2, true);
   this.add(this.weapon3, true);
   this.add(this.weapon4, true);
   this.add(this.weapon5, true);
   this.add(this.weapon6, true);

   this.power = 10;

   return this;

};

Weapon.Weapon6B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon6B.prototype.constructor = Weapon.Weapon6B;

Weapon.Weapon6B.prototype.fire = function (source) {
   this.weapon1.fireFrom(source, -15, 7);
   this.weapon2.fireFrom(source, -10, 5);
   this.weapon3.fireFrom(source, -5, 0);
   this.weapon4.fireFrom(source, 5, 0);
   this.weapon5.fireFrom(source, 10, 5);
   this.weapon6.fireFrom(source, 15, 7);
};
