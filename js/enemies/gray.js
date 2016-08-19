Gray = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, x, y, key, 100, 100, 5, fireProba, 250, 20, [8, 9], 6);
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
      this.shots.add(new Shot(this.game, 'enemyshots', 4, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};
