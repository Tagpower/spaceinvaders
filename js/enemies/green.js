Green = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, x, y, key, 300, 100, 3, fireProba, 200, 10, [4, 5], 6);
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
      this.shots.add(new Shot(game, 'enemyshots', 2, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};
