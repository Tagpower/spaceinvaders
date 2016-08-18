Pink = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, x, y, key, 100, 100, 8, fireProba*1.5, 400, 30, [14, 15], 6);
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
      this.shots.add(new Shot(game, 'enemyshots', 7, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};