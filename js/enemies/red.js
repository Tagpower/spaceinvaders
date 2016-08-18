Red = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, x, y, key, 100, 100, 2, fireProba*0.8, 200, 10, [2, 3], 6);
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
