var Player = function (state, key, frame, power) {

   Phaser.Sprite.call(this, state.game, 0, 0, key, frame);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.game.physics.arcade.enable(this);

   this.state = state;

   this.anchor.set(0.5);
   this.checkWorldBounds = true;

   this.body.collideWorldBounds = true;
   this.body.immovable = false;

   this.anchor.setTo(0.5,0.5); 

   this.animations.add('idle', [0,1],6,true); 
   this.animations.add('left', [2,3],6,true); 
   this.animations.add('right', [4,5],6,true);
   this.animations.add('dead', [6],6,true);

   // Weapons
   this.power = power;
   this.weapons = [];
   this.weapons.push(this.game.add.existing(new Weapon1B(this.state)));
   this.weapons.push(this.game.add.existing(new Weapon2B(this.state)));
   this.weapons.push(this.game.add.existing(new Weapon3B(this.state)));
   this.weapons.push(this.game.add.existing(new Weapon4B(this.state))); 
   this.weapons.push(this.game.add.existing(new Weapon5B(this.state))); 
   this.weapons.push(this.game.add.existing(new Weapon6B(this.state)));
   this.weapons.push(this.game.add.existing(new Weapon7B(this.state)));

   this.weapon = this.weapons[this.power-1];

   this.tracking = tracking;
   this.scaleSpeed = scaleSpeed;

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.death = function(obj) {
   var this = this;
   console.log("TOUCHÉ !!!");
   this.playerhit_sd.play();
   player.body.collideWorldBounds = false;
   player.body.velocity.y = 125;
   this.createExplosion(player.body.center.x, player.body.center.y, 20);

   if (!this.in_bonus_level) {
      //Player stats are halved
      if (difficulty == EASY) {
         if (this.power > 2) {
            this.power /= 2;
            this.power = Math.ceil(this.power);
         }
         else {
            this.power = 2;
         }
      } else {
         if (this.power > 1) {
            this.power /= 2;
            this.power = Math.floor(this.power);
         }
      }
      this.weapon = this.weapons[this.power-1];

      if (this.cooldown_reduction > 0) {
         this.cooldown_reduction /= 2;
         this.cooldown_reduction = Math.floor(this.cooldown_reduction);
      }
      this.special_available = 1;
      this.lives--;
      if (this.lives > 0) {
         this.timer = this.game.time.create(true);
         this.timer.add(1500, function(){
            player.body.collideWorldBounds = true;
            //player.y = 550;
            console.log("replace player");
            this.game.add.tween(player.body).to( { y: 700 }, 500, Phaser.Easing.Quadratic.In, true);
            this.game.add.tween(player.body).to( { x: 300 }, 500, Phaser.Easing.Quadratic.In, true);
            this.lostAlife = false;
            player.alpha = 0.5;
            this.shield_time = 180;
            player.addChild(this.shield);
            this.shield.anchor.setTo(0.5, 0.5);
            this.shield.smoothed = false;
         });
         this.timer.add(3000, function(){
            player.touched = false;
            player.alpha = 1;
         });
         this.timer.start();
      } else { //GAME OVER
         this.text_middle.alpha = 1;
         this.text_middle.text = 'GAME OVER';
         this.text_level.alpha = 1;
         this.text_level.text = 'Presser R pour recommencer';
      }
   } else {
      //If you die in a bonus level, no penalty
      this.timer = this.game.time.create(true);
      this.timer.add(1500, function(){
         player.body.collideWorldBounds = true;
         //player.y = 550;
         this.game.add.tween(player.body).to( { y: 700 }, 500, Phaser.Easing.Quadratic.In, true);
         this.game.add.tween(player.body).to( { x: 300 }, 500, Phaser.Easing.Quadratic.In, true);
         this.lostAlife = false;
         player.alpha = 0.5;
         this.enemies.removeAll(true);
         this.current_bonus_level--;
      });
      this.timer.add(3000, function(){
         player.touched = false;
         player.alpha = 1;
      });
      this.timer.start();
   }
}
}
