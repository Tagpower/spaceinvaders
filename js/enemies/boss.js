/*/
  ENEMY MOTHER CLASS !!!
//*/
var Boss = function (state, x, y, key, bulletSpeed, power, type, fireProba, value, health, framesAnim, timeAnim) {
   Enemy.call(this, state, x, y, key, bulletSpeed, power, type, fireProba, value, health, framesAnim, timeAnim);
}

Boss.prototype = Object.create(Boss.prototype);
Boss.prototype.constructor = Boss;



Boulimique = function (state, x, y, key) {
   var self = this;
   Boss.call(self, state, x, y, key, 100, 100, 9, ENEMY_DEFAULT_FIRE_PROBA*10, 150, 50);
   self.fireAngle = 0;
   self.angleOffset = 20;
   self.once = true;
   self.timer = self.game.time.create(true);
   self.timer.loop(50 - (difficulty*5), function() {
      self.makeBullet(self.shots, self.x, self.y, self.fireAngle, -self.bulletSpeed, 0, 0, 'enemyshots', 6, true);
      self.fireAngle += self.angleOffset;
      self.fireAngle %= 360;
      if (!self.state.mute) {
         self.state.enemyfire_sd.play();
      }
   }, self);
   self.events.onKilled.add(self.death, this); //FIXME
   self.fire();
};

Boulimique.prototype = Object.create(Enemy.prototype);
Boulimique.prototype.constructor = Boulimique; 

Boulimique.prototype.update = function() {
   this.setupCollision();
}

Boulimique.prototype.fire = function () {
   var self = this;
   self.timer.start();
};

Boulimique.prototype.death = function () { //TODO: Faire un effet de disparition trop trop classe
   var self = this;
   console.log("BOSS BATTU");
   self.timer.stop()
};
