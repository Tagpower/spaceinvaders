Enemy.Brown = function (state, x, y, key, fireProba) {

   Phaser.Sprite.call(this, state.game, x, y, key, 18);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = 100;
   this.power = 100;
   this.type = 10;
   this.fireProba = fireProba*0.75;
   this.value = 100;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);		
   this.body.immovable = true;
   this.state = state;
   this.health = 10;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);

   for (var i = 0; i < 5; i++) {
      this.shots.add(new Shot(game, 'enemyshots', 9, 10), true);
   }

   this.animations.add('move', [18, 19], 6, true);
   this.animations.play('move');

   this.events.onKilled.add(this.death, this);

   return this;
};

Enemy.Brown.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Brown.prototype.constructor = Enemy.Brown;

Enemy.Brown.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.Brown.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.Brown.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   try {
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 9, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
}

Enemy.Brown.prototype.death = function(obj) {
   var self = this;
      var expl = self.state.explosions.getFirstDead();
      if (expl === null || expl == undefined) {
         expl = self.state.state.game.add.sprite(self.x, self.y, 'explosion');
         self.state.explosions.add(expl);
      }
      else {
         expl.alpha = 1;
         expl.scale.setTo(1);
         expl.revive();
         expl.reset(self.x, self.y);
      }
      expl.power = 20;
      self.state.game.physics.arcade.enable(expl);
      expl.anchor.setTo(0.5);
      expl.smoothed = false;
      expl.body.immovable = true;
      expl.checkWorldBounds = true;
      expl.outOfBoundsKill = true;
      if (!self.state.mute) {
            self.state.playerhit_sd.play();
      }
      self.state.enemies.forEachAlive( function(e) {
         if (self.state.game.physics.arcade.distanceBetween(expl, e) < 40) {
            self.state.hitEnemy(expl, e);
         }
      });
      self.state.game.add.tween(expl).to( { alpha: 0}, 2000, Phaser.Easing.Quintic.Out, true);
      self.state.game.add.tween(expl.scale).to( {x: 2, y: 2 }, 1500, Phaser.Easing.Quintic.Out, true);
      self.destroy();
} 