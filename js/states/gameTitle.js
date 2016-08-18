var gameTitle = function(game) {
   console.log("Game Title");
}

gameTitle.prototype = {
   preload: function() {

   },
   create: function() {
      console.log("-*- Launch the game -*-");
      //parameters: difficulty, level, power, firerate, isBonus

      var easy_button = game.add.button(game.world.centerX, 400, 'menu_buttons', this.easy, this, 0, 0, 0, 0);
      easy_button.anchor.setTo(0.5);

      var normal_button = game.add.button(game.world.centerX, 450, 'menu_buttons', this.normal, this, 4, 4, 4, 4);
      normal_button.anchor.setTo(0.5);

      var hard_button = game.add.button(game.world.centerX, 500, 'menu_buttons', this.hard, this, 8, 8, 8, 8);
      hard_button.anchor.setTo(0.5);

      var ohgod_button = game.add.button(game.world.centerX, 550, 'menu_buttons', this.ohgod, this, 12, 12, 12, 12);
      ohgod_button.anchor.setTo(0.5);
      ohgod_button.animations.add('tilt', [12, 13, 14, 15], 25, true);
      ohgod_button.animations.play('tilt');
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
