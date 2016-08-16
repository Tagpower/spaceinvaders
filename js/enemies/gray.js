Enemy.Gray = function (state, x, y, key, fireProba) {

   Phaser.Sprite.call(this, state.game, x, y, key, 8);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = 100;
   this.power = 100;
   this.type = 5;
   this.fireProba = fireProba;
   this.value = 250;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);		
   this.body.immovable = true;
   this.state = state;
   this.health = 20;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);

   for (var i = 0; i < 5; i++) {
      this.shots.add(new Shot(game, 'enemyshots', 4, 10), true);
   }

   this.animations.add('move', [8, 9], 6, true);
   this.animations.play('move');

   return this;
};

Enemy.Gray.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Gray.prototype.constructor = Enemy.Gray;

Enemy.Gray.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.Gray.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.Gray.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   try {
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 4, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};
