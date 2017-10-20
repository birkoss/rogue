/*
	@TODO:
		- Fix the sprite of skeleton and wooden sword!
		- Allow the player to equip weapons

		- Flash the progress bar everytime it lose 1 value
		- Flash the health progress bar everytime the player is damaged

		- Allow the door to be unlocked only when a key is in the inventory

		- Detect if the player is dead (from health or hunger)
			- Show a popup with a restart

		- Adding an effect when a potion/hunger is restored
		- Adding a red ! when the enemy is alerted
		
		- Update the helper icons
			- Arrow for movement
			- Sword for physical attacl
			- Bow for ranged
			- Try to tween the item picked from the map TO the panel's slot
*/

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
