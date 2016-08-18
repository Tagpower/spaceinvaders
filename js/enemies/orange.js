Orange = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, x, y, key, 100, 100, 1, fireProba, 100, 10, [0, 1], 6);
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
      this.shots.add(new Shot(game, 'enemyshots', 0, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};
