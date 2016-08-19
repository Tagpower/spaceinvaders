Magenta = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, state.game, x, y, key, 200, 100, 12, fireProba*0.75, 300, 20, [22, 23], 6);
   this.shots.setAll('tracking', true);
};

Magenta.prototype = Object.create(Enemy.prototype);
Magenta.prototype.constructor = Magenta;

Magenta.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   var rand_offset = (Math.random() < 0.5 ? 0 : 11.25);
   for (var i = 0; i < 360; i+=22.5) {   
      try {
         this.shots.getFirstDead().fire(x, y, i+rand_offset, -this.bulletSpeed, 0, 0);
      } catch(err) {
         this.shots.add(new Shot(game, 'enemyshots', 11, 10), true);
         this.shots.setAll('tracking', true);
         this.shots.getFirstExists(false).fire(x, y, i+rand_offset, -this.bulletSpeed, 0, 0);
      }
   }
};