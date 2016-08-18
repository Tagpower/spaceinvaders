Purple = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, state.game, x, y, key, 100, 100, 4, fireProba*2, 150, 10, [6, 7], 6);
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
      this.shots.add(new Shot(game, 'enemyshots', 3, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};
