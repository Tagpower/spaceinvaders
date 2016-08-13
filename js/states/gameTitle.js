var gameTitle = function(game) {
   console.log("Game Title");
}

gameTitle.prototype = {
   preload: function() {

   },
   create: function() {
      console.log("-*- Launch the game -*-");
      //parameters: difficulty, level, power, firerate, isBonus
      var difficulty = NORMAL;
      var config = {
         is_boss: false,
         is_bonus: false,
         score: 0,
         lives: 3,
         power: difficulty == EASY ? 2 : 1,
         init_x: 300,
         init_y: 600,
         difficulty: difficulty,
         current_level: 0,
         special_available: 1,
         cooldown_reduction: 0,
         current_bonus_level: 0,
      };
      this.game.state.start("Game", true, false, config);
   }
}
