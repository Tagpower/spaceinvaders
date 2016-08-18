Blue = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, x, y, key, 100, 100, 9, fireProba*1.5, 150, 10, [16, 17], 6);
};

Blue.prototype = Object.create(Enemy.prototype);
Blue.prototype.constructor = Blue;

Blue.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   var angle = this.game.rnd.between(-20,20);
   var speed = this.game.rnd.between(50,200)

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead(false).fire(x, y, angle, -speed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(game, 'enemyshots', 8, 10), true);
      this.shots.setAll('tracking', true);
      this.shots.getFirstExists(false).fire(x, y, angle, -speed, 0, 0);
   }
};