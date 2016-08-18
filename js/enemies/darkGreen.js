DarkGreen = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, state.game, x, y, key, 600, 100, 11, fireProba*0.75, 400, 10, [20, 21], 6);
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
      this.shots.add(new Shot(game, 'enemyshots', 10, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
};