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
   Boss.call(self, state, x, y, key, 150, 100, 9, ENEMY_DEFAULT_FIRE_PROBA*10, 5000, 300);
   self.fireAngle = 0;
   self.angleOffset = 32;
   self.once = true;
   self.timer = self.game.time.create(true);
   self.fireDelay = 45 - difficulty*5;
   self.fire();
};

Boulimique.prototype = Object.create(Enemy.prototype);
Boulimique.prototype.constructor = Boulimique; 

Boulimique.prototype.update = function() {
   this.setupCollision();
   this.tint = 0xff7777 + (this.health/300 * 0x007777); //WIP
}

Boulimique.prototype.fire = function () {
   var self = this;
   self.timer.loop(self.fireDelay, function() {
      self.makeBullet(self.shots, self.x, self.y, self.fireAngle, -self.bulletSpeed, 0, 0, 'enemyshots', 6, true);
      self.fireAngle += self.angleOffset;
      self.fireAngle %= 360;
      if (!self.state.mute) {
         self.state.enemyfire_sd.play();
      }
   }, self);
   self.timer.start();
};

Boulimique.prototype.damage = function(amount) { //WIP
   var self = this;
   console.log("BOSS BATTU");
   self.health -= amount;

   if (self.alive && self.health <= 0) {
      self.alive = false;
      self.timer.stop();
      var delay = 125;
      var occurs = 20;
      var duration = delay * occurs;
      self.game.time.events.repeat(delay, occurs, function() {
         self.state.createExplosion(this.x + self.state.game.rnd.between(-20,20), this.y + self.state.game.rnd.between(-20,20), 0);
      }, self);

      var tween = self.game.add.tween(self);
      tween.to({"alpha": 0, "body.velocity.x": 0}, duration, "Linear", true);
      tween.onComplete.add(function() {
         self.shots.forEachAlive(function(s){
            new Coin(self.state, s.x, s.y, self.game.rnd.between(-50,50), self.game.rnd.between(-100,0), 100);
            s.kill();
         });
         new Powerup(self.state, self.x, self.y, 'powerups', 12, PowerupColl.extraLife);
         self.kill();
      }, self);
   }
};
