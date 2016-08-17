Enemy.Magenta = function (state, x, y, key, fireProba) {

   Phaser.Sprite.call(this, state.game, x, y, key, 22);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = 200;
   this.power = 100;
   this.type = 12;
   this.fireProba = fireProba;
   this.value = 300;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);		
   this.body.immovable = true;
   this.state = state;
   this.health = 20;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);
   this.shots.setAll('tracking', true);

   this.animations.add('move', [22, 23], 6, true);
   this.animations.play('move');

   return this;
};

Enemy.Magenta.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Magenta.prototype.constructor = Enemy.Magenta;

Enemy.Magenta.prototype.livingShots = function() {
   return this.shots.countLiving();
}

Enemy.Magenta.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (this.alive && Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.Magenta.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.Magenta.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   for (var i = -60; i < 60; i+=10) {   
      try {
         this.shots.getFirstDead().fire(x, y, i, -this.bulletSpeed, 0, 0);
      } catch(err) {
         this.shots.add(new Shot(game, 'enemyshots', 11, 10), true);
         this.shots.setAll('tracking', true);
         this.shots.getFirstExists(false).fire(x, y, i, -this.bulletSpeed, 0, 0);
      }
   }
};