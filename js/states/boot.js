var boot = function(game) {
   console.log("Booting...");
   Phaser.State.call(this);
}

boot.prototype = Object.create(Phaser.State);
boot.prototype.constructor = boot;

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

      console.log("-*- Load StateTransition -*-");
      this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
      this.game.stateTransition.configure({
         duration: Phaser.Timer.SECOND * 0.75,
         ease: Phaser.Easing.Exponential.InOut,
         properties: {
            alpha: 0
         }
      });

      //this.game.saveCpu = this.game.plugins.add(Phaser.Plugin.SaveCPU);

      console.log("-*- Booted -*-");
      this.game.state.start("Preload");
   }
}
