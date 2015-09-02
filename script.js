
// LOAD SPRITE SHEET
var spriteSheet = new Image();
spriteSheet.src = 'images/spritesheet.png';

// ON DOM LOADED
document.addEventListener('DOMContentLoaded', function () {


	// PLAY THE GAME!
	Impure.game(
		60, 
		document.getElementById('canvas'), 
		[
			// PLAYER ENTITY
			{
				id: 'player',
				pos: [
					[0, 0],
					[40, 40]
				],
				color: 'green',
				image: spriteSheet,
				imgPos: [0, 80]
			},
			// SECOND ENTITY
			{
				id: 'second',
				pos: [
					[100, 100],
					[140, 140]
				],
				color: 'red',
				image: spriteSheet,
				imgPos: [0, 40]
			}
		]
	);
});

