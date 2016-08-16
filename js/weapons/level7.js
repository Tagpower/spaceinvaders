Weapon.Weapon7B = function (game) {

   Phaser.Group.call(this, game, game.world, 'Base Weapon Level 7', false, true, Phaser.Physics.ARCADE);
   
   this.weapon1 = new Weapon.Weapon1B(game);
   this.weapon2 = new Weapon.Weapon1B(game);
   this.weapon3 = new Weapon.Weapon1B(game);
   this.weapon4 = new Weapon.Weapon1B(game);
   this.weapon5 = new Weapon.Weapon1B(game);
   this.weapon6 = new Weapon.Weapon1B(game);
   this.weapon7 = new Weapon.Weapon1B(game);

   this.add(this.weapon1, true);
   this.add(this.weapon2, true);
   this.add(this.weapon3, true);
   this.add(this.weapon4, true);
   this.add(this.weapon5, true);
   this.add(this.weapon6, true);
   this.add(this.weapon7, true);

   this.power = 10;

   return this;

};

Weapon.Weapon7B.prototype = Object.create(Phaser.Group.prototype);
Weapon.Weapon7B.prototype.constructor = Weapon.Weapon7B;

Weapon.Weapon7B.prototype.fire = function (source) {
   this.weapon1.fireFrom(source, -15, 9);
   this.weapon2.fireFrom(source, -10, 7);
   this.weapon3.fireFrom(source, -5, 5);
   this.weapon4.fireFrom(source, 0, 0);
   this.weapon5.fireFrom(source, 5, 5);
   this.weapon6.fireFrom(source, 10, 7);
   this.weapon7.fireFrom(source, 15, 9);
};
