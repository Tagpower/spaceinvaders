var Coin = function (state, x, y, velx, vely, value=100, key='coin', frame=3, animFrame=[0,1,2,3,4,5], animTime=16, animRepeat=true) {

   Phaser.Sprite.call(this, state.game, x, y, key, frame);

   this.state = state;
   this.game.add.existing(this);
   this.game.physics.arcade.enable(this);
   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
   this.anchor.set(0.5);
   this.checkWorldBounds = true;
   this.body.bounce.setTo(0.5,0.5);
   this.lifespan = 8000;
   this.body.velocity.setTo(velx, vely);
   this.body.collideWorldBounds = true;
   this.outOfBoundsKill = true;
   this.body.gravity.y = 100;
   this.body.mass = 0;
   this.value = value;

   this.state.items.add(this);

   this.animations.add('spin', animFrame, animTime, animRepeat);
   this.animations.play('spin');
};

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Powerup;

Coin.prototype.update = function() {
   this.game.physics.arcade.collide(this, this.state.player, this.collide, null, this);
}

Coin.prototype.collide = function(coin, player) {
   var self = this;
   coin.destroy();
   if (!self.state.lostAlife) {
      self.state.coins++;
      self.state.score += coin.value;
      self.state.text_coin.text = self.state.coins;
      self.state.text_coin.alpha = 1;
      self.state.text_coin.x = this.state.player.body.x + 16;
      self.state.text_coin.y = this.state.player.body.y - 10;
      var tween_points = self.state.game.add.tween(self.state.text_coin).to( { alpha: 0, y: player.body.y-40 }, 1000, Phaser.Easing.Linear.None, true);

      if (!self.state.mute) {
         self.state.pickupcoin_sd.play();
      }

      if (self.state.coins >= COINS_FOR_POWERUP) { //WIP
         //self.state.special_available++;
         new Powerup(self.state, 160, 37, 'powerups', 24, PowerupColl.special, true, [24,25,26,27], 18, true);
         self.state.coins %= COINS_FOR_POWERUP;
      }
   }
}