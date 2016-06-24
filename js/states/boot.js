var boot = function(game) {
   console.log("Booting...");
}

boot.prototype = {
   preload: function() {
      // load splash or loading bar
   },
   create : function() {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.setScreenSize();

      this.game.renderer.clearBeforeRender = false;
      this.game.renderer.roundPixels = true;

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      console.log("-*- Booted -*-");
      this.game.state.start("Preload");
   }
}
