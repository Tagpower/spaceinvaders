/*/
   ENEMY MOTHER CLASS !!!
//*/
var Enemy = function (state, x, y, key, bulletSpeed, power, type, fireProba, value, health, framesAnim, timeAnim) {
   Phaser.Sprite.call(this, state.game, x, y, key);

   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

   this.bulletSpeed = bulletSpeed;
   this.power = power;
   this.type = type;
   this.fireProba = fireProba;
   this.value = value;
   this.game.physics.arcade.enable(this);
   this.anchor.setTo(0.5);    
   this.body.immovable = true;
   this.state = state;
   this.health = health;

   this.shots = this.game.add.group(game.world, 'bullet pool', false, true, Phaser.Physics.ARCADE);

   if (framesAnim) {
      this.animations.add('move', framesAnim, timeAnim, true);
      this.animations.play('move');
   }
   this.events.onKilled.add(this.dropItem, this);
   this.events.onKilled.add(this.enemyDeath, this);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.livingShots = function() {
   return this.shots.countLiving();
}

Enemy.prototype.killShots = function() {
   this.shots.removeAll(true);
}

Enemy.prototype.destroy = function() {
   this.shots.removeAll(true);
   this.shots.destroy();
   this.visible = false;
   this.exists = false;
}

Enemy.prototype.collide = function(player, shot) {
   this.state.playerHit(player, shot);
}

Enemy.prototype.setupCollision = function() {
   this.game.physics.arcade.collide(this.shots, this.state.player, this.collide, function(){return (!this.state.lostAlife && this.state.shield_time == 0);}, this);
}

Enemy.prototype.update = function() {
   this.setupCollision();

   if (this.alive && Math.random() < this.fireProba && this.state.clear_nofiretime == 0) 
      this.fire();
}

Enemy.prototype.dropItem = function(obj) {
   var self = this;
   var x = obj.body.center.x;
   var y = obj.body.center.y;

   //randomly create a bonus
   var random = Math.random();
   if (random <= POWERUP_CHANCE || (this.state.in_bonus_level && random <= POWERUP_CHANCE_IN_BONUS)) { //In a bonus level, bonus are 2x as likely to appear
      
      //Bonus roulette
      var roulette = ["power","power","power",
                      "cooldown","cooldown","cooldown","cooldown",
                      "special","special","special",
                      "clear","clear","clear","clear",
                      "shield","shield","shield",
                      "freeze","freeze",
                      "kill","kill",
                      "warp","warp",
                      "life"];      
      
      var random = roulette[Math.floor(Math.random()*roulette.length)];
      console.log(random);

      switch (random) {
         case 'power':
            new Powerup(obj.state, x, y, 'powerups', 36, PowerupColl.power, true, [36, 37, 38, 39], 18, true);
         break;
         case 'cooldown':
            new Powerup(obj.state, x, y, 'powerups', 4, PowerupColl.cooldown, true, [4, 5, 6, 7], 18, true);
         break;
         case 'special':
            new Powerup(obj.state, x, y, 'powerups', 24, PowerupColl.special, true, [24,25,26,27], 18, true);
         break;
         case 'clear':
            new Powerup(this.state, x, y, 'powerups', 0, PowerupColl.clear, true, [0,1,2,3], 18, true);
         break;
         case 'life':
            new Powerup(obj.state, x, y, 'powerups', 12, PowerupColl.extraLife);
         break;
         case 'freeze':
            new Powerup(obj.state, x, y, 'powerups', 8, PowerupColl.freeze, true, [8,9,10,11], 18, true);
         break;
         case 'kill':
            new Powerup(obj.state, x, y, 'powerups', 32, PowerupColl.kill, true, [32,33,34,35], 18, true);
         break;
         case 'warp':
            new Powerup(obj.state, x, y, 'powerups', 28, PowerupColl.warp, true, [28,29,30,31], 18, true);
         break;
         case 'shield':
            new Powerup(this.state, x, y, 'powerups', 20, PowerupColl.shield, true, [20, 21, 22, 23], 18, true);
         break;
         case 'orange':
            new Powerup(obj.state, x, y, 'powerups', 16, PowerupColl.orange, true, [16,17,18,19], 18, true);
         break;
         case 'bonus':
            new Powerup(obj.state, x, y, 'powerups', 40, PowerupColl.bonusLevel, true, [40,41,42,43,44,45,46,47,48,49,50,51,52,53], 18, true);
         break;
      }
   }

   Enemy.prototype.dropCoin = function(proba) {
      new Coin(self.state, x, y, game.rnd.between(-30,30), game.rnd.between(-15,15), 100, 'coin', game.rnd.between(0,3)); //WIP
      if (Math.random() < proba) {
         self.dropCoin(proba/2);
      }
   }

   var proba = (self.state.in_bonus_level ? COIN_CHANCE_IN_BONUS : COIN_CHANCE);
   if (Math.random() < proba) {
      self.dropCoin(proba);
   }

}



Enemy.prototype.enemyDeath = function(obj) {
   var self = this;
   self.state.speed += self.state.speedup;
   self.state.speedup += self.state.accel;
   self.state.scorePool += self.value;
   if (!self.state.mute) {
      self.state.killenemy_sd.play();
   }
}

Enemy.prototype.makeBullet = function(group, x, y, angle, speed, gx, gy, key, frame, tracking=false, scaleSpeed=0, power=undefined) {
   if (power === undefined)
      power = this.power;
   try {
      group.getFirstDead().fire(x, y, angle, speed, gx, gy);
   } catch(err) {
      group.add(new Bullet(this.state.game, key, frame, power, tracking, scaleSpeed), true);
      group.getFirstExists(false).fire(x, y, angle, speed, gx, gy);
   }
}



Blue = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 9, ENEMY_DEFAULT_FIRE_PROBA*1.5, 150, 10, [16, 17], 6);
};

Blue.prototype = Object.create(Enemy.prototype);
Blue.prototype.constructor = Blue;

Blue.prototype.fire = function () {
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
      this.shots.add(new Bullet(this.game, 'enemyshots', 8, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, angle, -speed, 0, 0);
   }
};



Brown = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 10, ENEMY_DEFAULT_FIRE_PROBA*0.75, 100, 10, [18, 19], 6);
   this.events.onKilled.add(this.death, this);
};

Brown.prototype = Object.create(Enemy.prototype);
Brown.prototype.constructor = Brown;

Brown.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 9, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
}

Brown.prototype.death = function(obj) {
   this.state.createExplosion(obj.x, obj.y, 20);
} 



Cyan = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 7, ENEMY_DEFAULT_FIRE_PROBA*1.2, 200, 10, [12, 13], 6);
   this.shots.setAll('tracking', true);
};

Cyan.prototype = Object.create(Enemy.prototype);
Cyan.prototype.constructor = Cyan;

Cyan.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   var gx = 0;
   var dg = 20;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   if (this.state.player.x > x)
      gx = dg;
   else if (this.state.player.x < x)
      gx = -dg;

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, gx, 100);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 6, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, gx, 100);
   }
};



DarkGreen = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 600, 100, 11, ENEMY_DEFAULT_FIRE_PROBA, 400, 10, [20, 21], 6);
};

DarkGreen.prototype = Object.create(Enemy.prototype);
DarkGreen.prototype.constructor = DarkGreen;

DarkGreen.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 10, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};



Gray = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 5, ENEMY_DEFAULT_FIRE_PROBA, 250, 20, [8, 9], 6);
};

Gray.prototype = Object.create(Enemy.prototype);
Gray.prototype.constructor = Gray;

Gray.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 4, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};




Green = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 300, 100, 3, ENEMY_DEFAULT_FIRE_PROBA, 200, 10, [4, 5], 6);
};

Green.prototype = Object.create(Enemy.prototype);
Green.prototype.constructor = Green;

Green.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 2, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};




DarkRed = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 200, 100, 12, ENEMY_DEFAULT_FIRE_PROBA*0.6, 250, 10, [22, 23], 6);
   this.shots.setAll('tracking', true);
};

DarkRed.prototype = Object.create(Enemy.prototype);
DarkRed.prototype.constructor = DarkRed;

DarkRed.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   var rand_offset = (Math.random() < 0.5 ? 0 : 11.25);
   for (var i = 0; i < 360; i+=22.5) {   
      try {
         this.shots.getFirstDead().fire(x, y, i+rand_offset, -this.bulletSpeed, 0, 0);
      } catch(err) {
         this.shots.add(new Bullet(this.game, 'enemyshots', 11, 10), true);
         this.shots.setAll('tracking', true);
         this.shots.getFirstExists(false).fire(x, y, i+rand_offset, -this.bulletSpeed, 0, 0);
      }
   }
};



Orange = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 1, ENEMY_DEFAULT_FIRE_PROBA, 100, 10, [0, 1], 6);
};

Orange.prototype = Object.create(Enemy.prototype);
Orange.prototype.constructor = Orange;

Orange.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 0, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};




Pink = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 8, ENEMY_DEFAULT_FIRE_PROBA*1.5, 400, 30, [14, 15], 6);
};

Pink.prototype = Object.create(Enemy.prototype);
Pink.prototype.constructor = Pink;

Pink.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 7, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};



Purple = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 4, ENEMY_DEFAULT_FIRE_PROBA*2, 150, 10, [6, 7], 6);
};

Purple.prototype = Object.create(Enemy.prototype);
Purple.prototype.constructor = Purple;

Purple.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 3, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};




Red = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 2, ENEMY_DEFAULT_FIRE_PROBA*0.8, 200, 10, [2, 3], 6);
   this.shots.setAll('tracking', true);
};

Red.prototype = Object.create(Enemy.prototype);
Red.prototype.constructor = Red;

Red.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   var angle = 14.04;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, angle, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 1, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, angle, -this.bulletSpeed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 1, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y, -angle, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 1, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, -angle, -this.bulletSpeed, 0, 0);
   }
};




Yellow = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 100, 100, 6, ENEMY_DEFAULT_FIRE_PROBA*0.5, 100, 10, [10, 11], 6);
   this.events.onKilled.add(this.death, this);
};

Yellow.prototype = Object.create(Enemy.prototype);
Yellow.prototype.constructor = Yellow;

Yellow.prototype.livingShots = function() {
   return this.shots.countLiving();
}

Yellow.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 5, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};

Yellow.prototype.death = function(obj) {
   var x = this.x;
   var y = this.y;
   var speed = 250;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y,  17.74 , -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 17.74 , -speed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y, 9.09, -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 9.09 , -speed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y,  0, -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 0, -speed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y,  -9.09, -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, -9.09, -speed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y,  -17.74 , -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, -17.74 , -speed, 0, 0);
   }
}

//WIP
Black = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 200, 100, 13, ENEMY_DEFAULT_FIRE_PROBA, 250, 10, [24, 25], 6);
};

Black.prototype = Object.create(Enemy.prototype);
Black.prototype.constructor = Black;

Black.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 12, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }

   if (Math.random() < 0.20 && this.state.speed > 0){
      this.game.add.tween(this).to( {y: this.y + Math.random()*25 + 25}, 500, Phaser.Easing.Quadratic.Out, true);
   }
};

//TODO
White = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 200, 100, 14, ENEMY_DEFAULT_FIRE_PROBA*0.4, 150, 10, [26, 27], 6);
   this.fireTimer = this.game.time.create(false);
   this.minDelay = 2500;
   this.maxDelay = 5000;
   this.fireDelay = 0;
   this.setupDelay();
   this.power = 10;
   var self = this;
   this.events.onKilled.add(function() { 
      self.fireTimer.stop();
      self.fireTimer.destroy();
   }, this);
};

White.prototype = Object.create(Enemy.prototype);
White.prototype.constructor = White;

White.prototype.update = function() {
   this.setupCollision();
}

White.prototype.fire = function () { //TODO
   var self = this;

   var timer = this.game.time.create(true);
   

   timer.repeat(200, 5+difficulty,
         function() {
            var x = self.x;
            var y = self.y;
            x = self.x;
            y = self.y;
            if (!self.state.mute) {
               self.state.enemyfire_sd.play();
            }
            self.makeBullet(self.shots, x, y, 
                     self.game.math.radToDeg(Math.atan2((y - self.state.player.y), (x - self.state.player.x)))-270+self.game.math.between(-5,5),
                  -self.bulletSpeed, 0, 0, 'enemyshots', 13, true);
         }, self); 
   timer.start();

   this.fireTimer.stop();
   this.setupDelay();
};

White.prototype.setupDelay = function() {
   this.fireDelay = this.game.math.between(this.minDelay, this.maxDelay);
   this.fireTimer.add(this.fireDelay, this.fire, this);
   this.fireTimer.start();
};

//WIP
DarkCyan = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 300, 100, 15, ENEMY_DEFAULT_FIRE_PROBA*0.9, 300, 10, [28, 29], 6);
   this.shots.setAll('tracking', true);
};

DarkCyan.prototype = Object.create(Enemy.prototype);
DarkCyan.prototype.constructor = DarkCyan;

DarkCyan.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   var gx = 0;
   var gy = -100; //FIXME
   var dg = 0;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   // if (this.state.player.x > x)
   //    gx = dg;
   // else if (this.state.player.x < x)
   //    gx = -dg;
   //gx = this.state.player.x - x;

   try {
      this.shots.getFirstDead().fire(x, y, (180/Math.PI)*Math.atan2((y - this.state.player.y), (x - this.state.player.x))-90, this.bulletSpeed, gx, gy);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 14, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, (180/Math.PI)*Math.atan2((y - this.state.player.y), (y - this.state.player.x))-90, this.bulletSpeed, gx, gy);
   }
};

//WIP
Magenta = function (state, x, y, key) {
   Enemy.call(this, state, x, y, key, 200, 100, 16, ENEMY_DEFAULT_FIRE_PROBA*0.75, 350, 20, [30, 31], 6);
};

Magenta.prototype = Object.create(Enemy.prototype);
Magenta.prototype.constructor = Magenta;

Magenta.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Bullet(this.game, 'enemyshots', 15, 10, false, 0.075), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};
