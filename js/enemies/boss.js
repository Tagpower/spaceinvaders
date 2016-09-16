/*/
  ENEMY MOTHER CLASS !!!
//*/
var Boss = function (state, x, y, key, bulletSpeed, power, type, fireProba, value, health, framesAnim, timeAnim) {
   Enemy.call(this, state, x, y, key, bulletSpeed, power, type, fireProba, value, health, framesAnim, timeAnim);
}

Boss.prototype = Object.create(Boss.prototype);
Boss.prototype.constructor = Boss;



Boulimique = function (state, x, y, key) {
   Boss.call(this, state, x, y, key, 100, 100, 9, ENEMY_DEFAULT_FIRE_PROBA*10, 150, 50);
   this.fireAngle = 0;
   this.angleOffset = 20;
   this.once = true;
   this.fire();
};

Boulimique.prototype = Object.create(Enemy.prototype);
Boulimique.prototype.constructor = Boulimique;

Boulimique.prototype.update = function() {
   this.setupCollision();
}

Boulimique.prototype.fire = function () {
   var self = this;
   var timer = this.game.time.create(true);
   timer.loop(20, function() {
      self.makeBullet(self.shots, self.x, self.y, self.fireAngle, -self.bulletSpeed, 0, 0, 'enemy', 5, true);
      self.fireAngle += self.angleOffset;
      if (self.fireAngle >= 360) {
         if (!self.once) {  
            self.fireAngle = 10;
            self.once = true;
         }
         else {
            self.fireAngle = 0;
            self.once = false;
         }
      }
      if (!self.state.mute) {
         self.state.enemyfire_sd.play();
      }
   }, self);
   timer.start();
};
