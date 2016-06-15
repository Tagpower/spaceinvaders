var gameTitle = function(game) {
   console.log("Game Title");
}

gameTitle.prototype = {
   preload: function() {

   },
   create: function() {
      console.log("-*- Launch the game -*-");
      //parameters: difficulty, level, power, firerate
      this.game.state.start("Game", true, false, EASY, 1, 2, DEFAULT_FIRE_COOLDOWN);
   }
}
