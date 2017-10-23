/*
	@TODO:
		- Review all Popup's management
			- Use IDs instead of trying to guess the index they used

		- Remove the limit of size (4) of the inventory hardcoded everywhere, and use a variable instead

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

GAME.equipment = {
	head: null,
	body: null,
	jewel: null,
	armor: null,
	hand: "steel_sword",
	foot: null
};
GAME.inventory = ["potion", "apple", "potion"];

GAME.config = {};
GAME.config.scale = 2;
GAME.config.spriteSize = 24;

/* Phaser */

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Level', GAME.Level);

GAME.game.state.start('Boot');
