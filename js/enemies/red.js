Enemy.Red = function (state, x, y, key, fireProba) {

   Phaser.Sprite.call(this, state.game, x, y, key, 2);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = 100;
   this.power = 100;
   this.type = 2;
   this.fireProba = fireProba*0.8;
   this.value = 200;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);		
   this.body.immovable = true;
   this.state = state;
   this.health = 10;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);
   this.shots.setAll('tracking', true);

   this.animations.add('move', [2, 3], 6, true);
   this.animations.play('move');

   return this;
};

Enemy.Red.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Red.prototype.constructor = Enemy.Red;

Enemy.Red.prototype.livingShots = function() {
   return this.shots.countLiving();
}

Enemy.Red.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (this.alive && Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.Red.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.Red.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   var angle = 14.04;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, angle, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 1, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, angle, -this.bulletSpeed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 1, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y, -angle, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 1, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, -angle, -this.bulletSpeed, 0, 0);
   }
};
