var game = new Phaser.Game(600, 800, Phaser.AUTO, 'contentor');

game.state.add("Boot", boot);
game.state.add("Preload", preload);
game.state.add("GameTitle", gameTitle);
game.state.add("Game", invaders);
game.state.add("GameOver", gameOver);

game.state.start("Boot");
