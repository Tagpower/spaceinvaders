var gameTitle = function(game) {
   console.log("Game Title");
}

gameTitle.prototype = {
   preload: function() {

   },
   create: function() {
      console.log("-*- Launch the game -*-");
      //parameters: difficulty, level, power, firerate, isBonus

      this.background = game.add.tileSprite(0, 0, game.width, game.height, 'space');

      var easy_button = game.add.button(game.world.centerX, 400, 'menu_buttons', this.easy, this, 0, 0, 0, 0);
      easy_button.anchor.setTo(0.5);

      var normal_button = game.add.button(game.world.centerX, 450, 'menu_buttons', this.normal, this, 1,1,1,1);
      normal_button.anchor.setTo(0.5);

      var hard_button = game.add.button(game.world.centerX, 500, 'menu_buttons', this.hard, this, 2,2,2,2);
      hard_button.anchor.setTo(0.5);

      var ohgod_button = game.add.button(game.world.centerX, 550, 'menu_buttons', this.ohgod, this, 3,3,3,3);
      ohgod_button.anchor.setTo(0.5);
      ohgod_button.animations.add('tilt', [3,4,5,6], 25, true);
      ohgod_button.animations.play('tilt');

      var text_difficulty = self.game.add.text(self.game.world.width/2, game.world.height/2 + 40, '', {font: '16px Minecraftia', fill: '#00aaff'});
      text_difficulty.fixedToCamera = true;
      text_difficulty.anchor.setTo(0.5);
      text_difficulty.text = "Choisissez la difficulté :";
   },

   update: function() {
      this.background.tilePosition.y += 1
   },

   easy: function() {
      this.launch(EASY, 2);
   },

   normal: function() {
      this.launch(NORMAL, 1);
   },

   hard: function() {
      this.launch(HARD, 1);
   },

   ohgod: function() {
      this.launch(OHGOD, 1);
   },

   launch: function(difficulty, power) {
      var config = {
         is_boss: false,
         is_bonus: false,
         score: 0,
         lives: 3,
         power: power,
         init_x: 300,
         init_y: 700,
         difficulty: difficulty,
         current_level: 0,
         special_available: 1,
         cooldown_reduction: 0,
         current_bonus_level: 0,
      };
      this.game.state.start("Game", true, false, config);
   }

}
