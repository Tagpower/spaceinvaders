Enemy.Cyan = function (state, x, y, key, fireProba) {

   Phaser.Sprite.call(this, state.game, x, y, key, 12);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = 100;
   this.power = 100;
   this.type = 7;
   this.fireProba = fireProba*1.2;
   this.value = 200;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);		
   this.body.immovable = true;
   this.state = state;
   this.health = 10;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);

   for (var i = 0; i < 5; i++) {
      this.shots.add(new Shot(game, 'enemyshots', 6, 10), true);
   }
   this.shots.setAll('tracking', true);

   this.animations.add('move', [12, 13], 6, true);
   this.animations.play('move');

   return this;
};

Enemy.Cyan.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Cyan.prototype.constructor = Enemy.Cyan;

Enemy.Cyan.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.Cyan.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.Cyan.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   var gx = 0;
   var dg = 20;

   if (!self.state.mute) {
      self.state.enemyfire_sd.play();
   }

   if (this.state.player.x > x)
      gx = dg;
   else if (this.state.player.x < x)
      gx = -dg;

   try {
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, gx, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 6, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, gx, 0);
   }
};