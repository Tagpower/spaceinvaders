var Weapon = function(state, bulletSpeed, baseFireRate, power) {
   Phaser.Group.call(this, state.game, state.game.world, 'Weapon', false, true, Phaser.Physics.ARCADE);

   this.nextFire = 0;
   this.bulletSpeed = bulletSpeed;
   this.baseFireRate = baseFireRate;
   this.fireRate = baseFireRate;
   this.power = power;
   this.state = state;
   //console.log(baseFireRate);
   //console.log(this.baseFireRate);

   this.special = this.game.add.group(state.game.world, 'Special Weapon', false, true, Phaser.Physics.ARCADE);
   this.game.add.existing(this);
}

Weapon.prototype = Object.create(Phaser.Group.prototype);

Weapon.prototype.update = function() {
   this.game.physics.arcade.collide(this.special, this.state.enemies, this.collide, null, this);
   this.game.physics.arcade.collide(this, this.state.bonusships, this.collideShip, null, this);
   this.game.physics.arcade.collide(this.special, this.state.bonusships, this.collideShip, null, this);
   Phaser.Group.prototype.update.call(this);
}

Weapon.prototype.collide = function(shot, enemy) {
   this.state.hitEnemy(shot, enemy);
}

Weapon.prototype.collideShip = function(shot, ship) {
   ship.damage(shot.power);
   shot.kill();
}

Weapon.prototype.makeBullet = function(group, x, y, angle, speed, gx, gy, key, frame, tracking=false, scaleSpeed=0, power=undefined) {
   if (power === undefined)
      power = this.power;
   try {
      group.getFirstDead().fire(x, y, angle, speed, gx, gy);
   } catch(err) {
      group.add(new Bullet(this.state.game, key, frame, power, tracking, scaleSpeed), true);
      group.getFirstExists(false).fire(x, y, angle, speed, gx, gy);
   }
}



Weapon1B = function (state) {
   Weapon.call(this, state, 400, 750, 10);
   return this;
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

   this.makeBullet(this, x, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;

};

Weapon1B.prototype.fireSpecial = function () {
   var self = this;

   var timer = this.game.time.create(true);
   timer.repeat(200, 8,
    function() { 
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, 0, 300, 0, 0, 'shot', 0);
   }, this.game);
   timer.start();
};



Weapon2B = function (state) {
   Weapon.call(this, state, 400, 1000, 10);
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

   this.makeBullet(this, x-5, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+5, y, 0, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon2B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(100, 10,
    function() {
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      var angle = self.game.rnd.between(-10,10);
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, angle, 300, 0, 0, 'shot', 0);
   }, this.game);
   timer.start();
};




Weapon3B = function (state) {
   Weapon.call(this, state, 400, 1250, 10);
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

   this.makeBullet(this, x-5, y+5, -2, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x  , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+5, y+5, 2, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon3B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(100, 10,
    function(speed) {
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      var gx = 100;
      var angle = 0;
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, angle, speed, -gx, 0, 'shot', 0, true);
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, angle, speed,   0, 0, 'shot', 0, true);
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, angle, speed,  gx, 0, 'shot', 0, true);
   }, this.game, speed);
   timer.start();
};



Weapon4B = function (state) {
   Weapon.call(this, state, 400, 1500, 10);
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

   this.makeBullet(this, x-10, y+5, -2, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x-5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+10, y+5, 2, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon4B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 300;

   var timer = this.game.time.create(true);
   timer.repeat(250, 7,
    function(speed) {
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      var angle = 20;

      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, -angle  , speed,   0, 0, 'shot', 0, true);
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, -angle/2, speed,   0, 0, 'shot', 0, true);
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20,        0, speed,   0, 0, 'shot', 0, true);
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20,  angle/2, speed,   0, 0, 'shot', 0, true);
      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20,  angle  , speed,   0, 0, 'shot', 0, true);
   }, this.game, speed);
   timer.start();
};



Weapon5B = function (state) {
   Weapon.call(this, state, 400, 1750, 10);
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

   this.makeBullet(this, x-10, y+7, -4, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x-5 , y+5, -2, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x   , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+5 , y+5, 2, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+10, y+7, 4, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon5B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 100;

   var timer = this.game.time.create(true);
   timer.repeat(100, 30,
    function() {
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      var gx = self.game.rnd.between(-40, 40);
      var gy = self.game.rnd.between(100, 200);

      self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, 0, 100, gx, -gy, 'shot', 0, true);
   }, this.game);
   timer.start();
};



Weapon6B = function (state) {
   Weapon.call(this, state, 400, 2000, 10);
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

   this.makeBullet(this, x-15, y+7, -4, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x-10, y+5, -2, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x-5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+5 , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+10, y+5, 2, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+15, y+7, 4, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon6B.prototype.fireSpecial = function () {
   var self = this;

   var timer = this.game.time.create(true);
   timer.repeat(100, 3,
    function() {
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      for (var i = -70; i < 70; i+=5) {
         self.makeBullet(self.special, self.state.player.x, self.state.player.y-20, i, 500,   0, 0, 'shot', 0, true);
      }
   }, this.game);
   timer.start();
};



Weapon7B = function (state) {
   Weapon.call(this, state, 400, 2250, 10);
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
      
   this.makeBullet(this, x-15, y+9, -6, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x-10, y+7, -4, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x-5 , y+5, -2, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x   , y  , 0, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+5 , y+5, 2, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+10, y+7, 4, this.bulletSpeed, 0, 0, 'shot', 0);
   this.makeBullet(this, x+15, y+9, 6, this.bulletSpeed, 0, 0, 'shot', 0);

   this.nextFire = this.game.time.time + this.fireRate;
};

Weapon7B.prototype.fireSpecial = function () {
   var self = this;
   var speed = 500;

   var timer = this.game.time.create(true);
   timer.repeat(300, 5,
    function(speed) {
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, 0, speed, 0, 0);
      } catch(err) {
         var bullet = new Bullet(self.game, 'enemyshots', 2, 100);
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


WeaponKill = function (state) {
   Weapon.call(this, state, 400, 2250, 10);
};

WeaponKill.prototype = Object.create(Weapon.prototype);
WeaponKill.prototype.constructor = Weapon7B;

WeaponKill.prototype.fireSpecial = function () {
   var self = this;

   var timer = this.game.time.create(true);
   var alpha = -45;
   timer.repeat(100, 19,
    function(speed) {
      if (!self.state.mute) {
         self.state.firespecial_sd.play();
      }
      try {
         self.special.getFirstDead().fire(self.state.player.x, self.state.player.y-20, alpha, 500, 0, 0);
      } catch(err) {
         var bullet = new Bullet(self.game, 'enemyshots', 2, 100);
         bullet.events.onKilled.add(self.specialDeath, self);
         self.special.add(bullet, true);
         self.special.getFirstExists(false).fire(self.state.player.x, self.state.player.y-20, alpha, 500, 0, 0);
         
      }
      self.special.setAll('tracking', true);
      alpha += 5;
   }, this.game);
   timer.start();
};

WeaponKill.prototype.specialDeath = function (obj) {
   this.state.createExplosion(obj.x, obj.y, 50);
};