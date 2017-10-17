var GAME = GAME || {};

GAME.config = {};
GAME.config.scale = 2;
GAME.config.spriteSize = 24;

/* Phaser */

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Level', GAME.Level);

GAME.game.state.start('Boot');
