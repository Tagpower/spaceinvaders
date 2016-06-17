var gameTitle = function(game) {
   console.log("Game Title");
}

gameTitle.prototype = {
   preload: function() {

   },
   create: function() {
      console.log("-*- Launch the game -*-");
      //parameters: difficulty, level, power, firerate, isBonus
      this.game.state.start("Game", true, false, EASY, 0, 2, DEFAULT_FIRE_COOLDOWN, false);
   }
}
