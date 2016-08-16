Enemy.Purple = function (state, x, y, key, fireProba) {

   Phaser.Sprite.call(this, state.game, x, y, key, 6);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = 100;
   this.power = 100;
   this.type = 4;
   this.fireProba = fireProba*2;
   this.value = 150;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);		
   this.body.immovable = true;
   this.state = state;
   this.health = 10;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);

   for (var i = 0; i < 5; i++) {
      this.shots.add(new Shot(game, 'enemyshots', 3, 10), true);
   }

   this.animations.add('move', [6, 7], 6, true);
   this.animations.play('move');

   return this;
};

Enemy.Purple.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Purple.prototype.constructor = Enemy.Purple;

Enemy.Purple.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.Purple.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.Purple.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   try {
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 3, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};