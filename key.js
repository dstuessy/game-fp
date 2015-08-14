
/**
 * Object for managing key presses.
 * This allows for fluent key press control.
 *
 * Code obtained but modified from here: http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
 *
 * @type object
 */
var KEY = {
	down: {},
	isDown: function (keyCode) {
		return this.down[ keyCode ];
	},
	onKeyDown: function (keyCode) {
		this.down[ keyCode ] = true;
	},
	onKeyUp: function (keyCode) {
		delete this.down[ keyCode ];
	},
	resetAll: function () {
		this.down = {};
	}
};

