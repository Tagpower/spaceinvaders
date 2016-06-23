
//BONUS LEVEL
//ENORME TODO
function loadBonusLevel(lvl) {
   music.stop();
   if(!mute && !in_bonus_level) {
      music_bonus.play();  
   }
   in_bonus_level = true;

   text_middle.text = "Niveau bonus !";
   text_level.text = "YAY ! (il est en travaux btw)";
   //text_level.text = level_names_en[lvl];
   text_middle.alpha = 0;
   text_level.alpha = 0;

   game.add.tween(text_middle).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);
   game.add.tween(text_level).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true);


   speed = START_SPEED;
   speedup = SPEEDUP_INIT;
   accel = SPEEDUP_ACCEL;
   /*timer = new Phaser.Timer(game, false);
   timer.add(Phaser.Timer.SECOND*2, createEnemies(levels[lvl]), this);
   timer.start(2000);
   */
   window.setTimeout(function(){
      game.add.tween(text_middle).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
      game.add.tween(text_level) .to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
      //createEnemies(levels[lvl]);   
   }, 3000);
   createEnemies(bonus_levels[lvl]);
}
