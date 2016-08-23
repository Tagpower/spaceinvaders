var Player = function (game, key, frame, power) {

	Phaser.Sprite.call(this, game, 0, 0, key, frame);

	this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

	this.game.physics.arcade.enable(this);

	this.anchor.set(0.5);
	this.checkWorldBounds = true;

	this.body.collideWorldBounds = true;
	this.body.immovable = false;

	this.anchor.setTo(0.5,0.5);

	this.animations.add('idle', [0,1],6,true);
	this.animations.add('left', [2,3],6,true);
	this.animations.add('right', [4,5],6,true);
	this.animations.add('dead', [6],6,true);

	this.weapon = this.weapons[this.power-1];

	this.tracking = tracking;
	this.scaleSpeed = scaleSpeed;

	this.power = power;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;