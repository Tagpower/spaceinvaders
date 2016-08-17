Enemy.Yellow = function (state, x, y, key, fireProba) {

   Phaser.Sprite.call(this, state.game, x, y, key, 10);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = 100;
   this.power = 100;
   this.type = 6;
   this.fireProba = fireProba*0.5;
   this.value = 100;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);		
   this.body.immovable = true;
   this.state = state;
   this.health = 10;

   this.events.onKilled.add(this.death, this);

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);

   for (var i = 0; i < 5; i++) {
      this.shots.add(new Shot(game, 'enemyshots', 5, 10), true);
   }

   this.animations.add('move', [10, 11], 6, true);
   this.animations.play('move');

   return this;
};

Enemy.Yellow.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Yellow.prototype.constructor = Enemy.Yellow;

Enemy.Yellow.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.Yellow.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.Yellow.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 5, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};

Enemy.Yellow.prototype.death = function(obj) {
   var x = this.x;
   var y = this.y;
   var speed = 250;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstExists(false).fire(x, y,  17.74 , -speed, 0, 0);
      this.shots.getFirstExists(false).fire(x, y,   9.09 , -speed, 0, 0);
      this.shots.getFirstExists(false).fire(x, y,   0    , -speed, 0, 0);
      this.shots.getFirstExists(false).fire(x, y, - 9.09 , -speed, 0, 0);
      this.shots.getFirstExists(false).fire(x, y, -17.74 , -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 5, 10), true);
      this.shots.add(new Shot(game, 'enemyshots', 5, 10), true);
      this.shots.add(new Shot(game, 'enemyshots', 5, 10), true);
      this.shots.add(new Shot(game, 'enemyshots', 5, 10), true);
      this.shots.add(new Shot(game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y,  17.74 , -speed, 0, 0);
      this.shots.getFirstExists(false).fire(x, y,   9.09 , -speed, 0, 0);
      this.shots.getFirstExists(false).fire(x, y,   0    , -speed, 0, 0);
      this.shots.getFirstExists(false).fire(x, y, - 9.09 , -speed, 0, 0);
      this.shots.getFirstExists(false).fire(x, y, -17.74 , -speed, 0, 0);
   }

   this.destroy();
}
