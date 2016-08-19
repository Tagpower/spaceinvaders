var Weapon = function(state, bulletSpeed, fireRate, power) {
   Phaser.Group.call(this, state.game, state.game.world, 'Weapon', false, true, Phaser.Physics.ARCADE);

   this.nextFire = 0;
   this.bulletSpeed = bulletSpeed;
   this.fireRate = fireRate;
   this.power = power;
   this.state = state;

   this.special = this.game.add.group(state.game.world, 'Special Weapon', false, true, Phaser.Physics.ARCADE);
}

Weapon.prototype = Object.create(Phaser.Group.prototype);

Weapon.prototype.update = function() {
   this.game.physics.arcade.collide(this.special, this.state.enemies, this.collide, false, this);
}

Weapon.prototype.collide = function(shot, enemy) {
   this.state.hitEnemy(shot, enemy);
}

Weapon.prototype.makeBullet = function(x, y, angle, speed, gx, gy, key, frame) {
   try {
      this.getFirstDead().fire(x, y, angle, speed, gx, gy);
   } catch(err) {
      this.add(new Bullet(game, key, frame, this.power), true);
      this.getFirstExists(false).fire(x, y, angle, speed, gx, gy);
   }
}



Weapon1B = function (state) {
   Weapon.call(this, state, 400, 500, 10);
};

Weapon1B.prototype = Object.create(Weapon.prototype);
Weapon1B.prototype.constructor = Weapon1B;

Weapon1B.prototype.fire = function (source) {

   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;

};

Weapon1B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(200, 6,
    function(speed, power) { 
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0); 
      }
      catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0); 
      }
   }, this.game, speed, this.power);
   timer.start();
};



Weapon2B = function (state) {
   Weapon.call(this, state, 500, 1000, 10);
   this.special.setAll('tracking', true);
};

Weapon2B.prototype = Object.create(Weapon.prototype);
Weapon2B.prototype.constructor = Weapon2B;

Weapon2B.prototype.fire = function (source) {

   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-5, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon2B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(100, 10,
    function(speed, power) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var angle = self.game.rnd.between(-10,10);
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, angle, speed, 0, 0);
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, angle, speed, 0, 0);
      }
   }, this.game, speed, this.power);
   timer.start();
};




Weapon3B = function (state) {
   Weapon.call(this, state, 400, 1500, 10);
   this.special.setAll('tracking', true);
};

Weapon3B.prototype = Object.create(Weapon.prototype);
Weapon3B.prototype.constructor = Weapon3B;

Weapon3B.prototype.fire = function (source) {
   
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-5, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x  , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon3B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(100, 10,
    function(speed, power) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var gx = 100;
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, -gx, 0);
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, -gx, 0);
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, 0); 
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, 0); 
      }
   }, this.game, speed, this.power);
   timer.start();
};



Weapon4B = function (state) {
   Weapon.call(this, state, 500, 1000, 10);
   this.special.setAll('tracking', true);
};

Weapon4B.prototype = Object.create(Weapon.prototype);
Weapon4B.prototype.constructor = Weapon4B;

Weapon4B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-10, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+10, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon4B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(500, 5,
    function(speed, power) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var angle = 20;

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, -angle, speed, 0, 0); 
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, -angle, speed, 0, 0); 
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, -angle/2, speed, 0, 0); 
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, -angle/2, speed, 0, 0); 
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);  
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);  
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, angle/2, speed, 0, 0);  
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, angle/2, speed, 0, 0);  
      }

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, angle, speed, 0, 0);  
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.setAll('tracking', true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, angle, speed, 0, 0);  
      }
   }, this.game, speed, this.power);
   timer.start();
};



Weapon5B = function (state) {
   Weapon.call(this, state, 500, 1000, 10);
   this.special.setAll('tracking', true);
};

Weapon5B.prototype = Object.create(Weapon.prototype);
Weapon5B.prototype.constructor = Weapon5B;

Weapon5B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-10, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-5 , y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x   , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5 , y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+10, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon5B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 100;

   var timer = this.game.time.create(true);
   timer.repeat(100, 15,
    function(speed, power) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      var gx = self.game.rnd.between(-40, 40);
      var gy = self.game.rnd.between(100, 200);

      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, -gy);
      } catch(err) {
         self.special.add(new Bullet(game, 'shot', 0, power), true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, gx, -gy);
      }
   }, this.game, speed, this.power);
   timer.start();
};



Weapon6B = function (state) {
   Weapon.call(this, state, 500, 1000, 10);
   this.special.setAll('tracking', true);
};

Weapon6B.prototype = Object.create(Weapon.prototype);
Weapon6B.prototype.constructor = Weapon6B;

Weapon6B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }

   this.makeBullet(x-15, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-10, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+10, y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+15, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon6B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 500;

   var timer = this.game.time.create(true);
   timer.repeat(100, 3,
    function(speed, power) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      for (var i = -70; i < 70; i+=5) {
         try {
            self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, i, speed, 0, 0);
         } catch(err) {
            self.special.add(new Bullet(game, 'shot', 0, power), true);
            self.special.setAll('tracking', true);
            self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, i, speed, 0, 0);
         }
      }
   }, this.game, speed, this.power);
   timer.start();
};



Weapon7B = function (state) {
   Weapon.call(this, state, 400, 3500, 10);
};

Weapon7B.prototype = Object.create(Weapon.prototype);
Weapon7B.prototype.constructor = Weapon7B;

Weapon7B.prototype.fire = function (source) {
   if (this.game.time.time < this.nextFire) { return; }

   var x = source.x;
   var y = source.y - 20;

   if (!this.state.mute) {
      this.state.fire_sd.play();
   }
      
   this.makeBullet(x-15, y+9, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-10, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x-5 , y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x   , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+5 , y+5, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+10, y+7, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(x+15, y+9, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon7B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 500;

   var timer = this.game.time.create(true);
   timer.repeat(300, 5,
    function(speed) {
      if (!this.state.mute) {
         self.state.firespecial_sd.play();
      }
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      } catch(err) {
         var bullet = new Shot(self.game, 'enemyshots', 2, 100);
         bullet.events.onKilled.add(self.specialDeath, self);
         self.special.add(bullet, true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      }
   }, this.game, speed);
   timer.start();
};

Weapon7B.prototype.specialDeath = function (obj) {
   console.log("death");
   this.state.createExplosion(obj.x, obj.y, 50);
};