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
   Boss.call(self, state, x, y, key, 150, 100, 9, ENEMY_DEFAULT_FIRE_PROBA*10, 5000, 10);
   self.fireAngle = 0;
   self.angleOffset = 32;
   self.once = true;
   self.timer = self.game.time.create(true);
   self.fireDelay = 45 - difficulty*5;
   self.timer.loop(self.fireDelay, function() {
      self.makeBullet(self.shots, self.x, self.y, self.fireAngle, -self.bulletSpeed, 0, 0, 'enemyshots', 6, true);
      self.fireAngle += self.angleOffset;
      self.fireAngle %= 360;
      if (!self.state.mute) {
         self.state.enemyfire_sd.play();
      }
   }, self);
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

Boulimique.prototype.kill = function() {
   var self = this;
   console.log("BOSS BATTU");
   //TODO: Transformer tous les tirs ennemis en pièces qui donnent des points ^^
   self.timer.stop();
   self.game.time.events.repeat(125, 20, function() {
      self.state.createExplosion(this.x + self.state.game.rnd.between(-20,20), this.y + self.state.game.rnd.between(-20,20), 0);
   }, self);
   self.shots.forEach(function(s){
      new Coin(self.state, s.x, s.y, self.game.rnd.between(-50,50), self.game.rnd.between(-100,0), 100);
      s.kill();
   });
   self.alive = false;
   self.visible = false;
   self.exists = false;
   //this.body.velocity.setTo(0,0);
   //this.animations.stop();
   //this.animations.play('die');
   if (self.events) {
       self.events.onKilled$dispatch(self);
   }

    return self;
};
