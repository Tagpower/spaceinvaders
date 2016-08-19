Brown = function (state, x, y, key, fireProba) {
   Enemy.call(this, state, x, y, key, 100, 100, 10, fireProba*0.75, 100, 10, [18, 19], 6);
   this.events.onKilled.add(this.death, this);
};

Brown.prototype = Object.create(Enemy.prototype);
Brown.prototype.constructor = Brown;

Brown.prototype.fire = function () {
   var x = this.x;
   var y = this.y;

   if (!this.state.mute) {
      this.state.enemyfire_sd.play();
   }

   try {
      this.shots.getFirstDead().fire(x, y, 0, -this.bulletSpeed, 0, 0);
   } catch(err) {
      this.shots.add(new Shot(this.game, 'enemyshots', 9, 10), true);
      this.shots.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
   }
}

Brown.prototype.death = function(obj) {
   this.state.createExplosion(obj.x, obj.y, 20);
} 