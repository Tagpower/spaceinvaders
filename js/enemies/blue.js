Enemy.Blue = function (state, x, y, key, fireProba) {

   Phaser.Sprite.call(this, state.game, x, y, key, 16);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = 100;
   this.power = 100;
   this.type = 9;
   this.fireProba = fireProba*1.5;
   this.value = 150;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);		
   this.body.immovable = true;
   this.state = state;
   this.health = 10;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);

   this.shots.setAll('tracking', true);

   this.animations.add('move', [16, 17], 6, true);
   this.animations.play('move');

   return this;
};

Enemy.Blue.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Blue.prototype.constructor = Enemy.Blue;

Enemy.Blue.prototype.livingShots = function() {
   return this.shots.countLiving();
}

Enemy.Blue.prototype.update = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);

   if (this.alive && Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.Blue.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.Blue.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   var angle = this.game.rnd.between(-20,20);
   var speed = this.game.rnd.between(50,200)

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead(false).fire(x, y, angle, -speed, 0, 0);
   } catch(err) {
      this.shots.getFirstExists(false).fire(x, y, angle, -speed, 0, 0);
   }
};