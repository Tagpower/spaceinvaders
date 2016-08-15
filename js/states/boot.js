var boot = function(game) {
   console.log("Booting...");
}

boot.prototype = {
   preload: function() {
      
      this.game.load.image('loading', 'assets/loadingbar.png');
   },
   create : function() {
      this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
      //this.scale.pageAlignHorizontally = true;

      this.game.renderer.clearBeforeRender = false;
      this.game.renderer.roundPixels = false;

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      console.log("-*- Booted -*-");
      this.game.state.start("Preload");
   }
}
