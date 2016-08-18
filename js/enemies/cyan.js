Cyan = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, state.game, x, y, key, 100, 100, 7, fireProba*1.2, 200, 10, [12, 13], 6);
   this.shots.setAll('tracking', true);
};

Cyan.prototype = Object.create(Enemy.prototype);
Cyan.prototype.constructor = Cyan;

Cyan.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   var gx = 0;
   var dg = 20;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   if (this.state.player.x > x)
      gx = dg;
   else if (this.state.player.x < x)
      gx = -dg;

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, gx, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 6, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, gx, 0);
   }
};