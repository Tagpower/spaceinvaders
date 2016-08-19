Yellow = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, x, y, key, 100, 100, 6, fireProba*0.5, 100, 10, [10, 11], 6);
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
      this.shots.add(new Shot(this.game, 'enemyshots', 5, 10), true);
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
      this.shots.add(new Shot(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 17.74 , -speed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y, 9.09, -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 9.09 , -speed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y,  0, -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 0, -speed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y,  -9.09, -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, -9.09, -speed, 0, 0);
   }

   try {
      this.shots.getFirstDead().fire(x, y,  -17.74 , -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(this.game, 'enemyshots', 5, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, -17.74 , -speed, 0, 0);
   }
}
