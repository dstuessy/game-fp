
/**
 * Shallow clones an array
 * Returns a new array comprising of the
 * same values.
 *
 * @param array array Array to be cloned.
 * @return array New array of cloned array.
 */
var cloneArray = function (array) {
	return [].concat(array);
};

/**
 * Reverse given array.
 * @param array array Array to be reversed.
 * @return array Reversed array.
 */
var reverse = function (array) {
	return array.reverse();
};

/**
 * Flip the order the arguments are
 * passed to the given function.
 *
 * @param function fn Function for which arguments should be reversed
 * @return function New Function with reversed arguments.
 */
var flip = function (fn) {

	return function () {

		var args = reverse(_.toArray(arguments));

		return fn.apply(null, args);
	};
};

var y = function (mtx) {
	return mtx[0][1];
};

var x = function (mtx) {
	return mtx[0][0];
};

var height = function (mtx) {
	return mtx[1][1] - mtx[0][1];
};

var width = function (mtx) {
	return mtx[1][0] - mtx[0][0];
};

var add = function (a, b) {
	console.log(a, b);
	return a + b;
};

var Matrix = {
	multiply: _.compose(_.partial(_.map, _, function (m, i) {
	}), Array)
};

var test = [1,2,3];
var test2 = [3,3,3];

var merge = function (arr, arr2, fn) {
	return _.map(arr, function (a, i) {
		var b = arr2[i];
		return _.bind(fn, this, a, b)();
	}.bind(this));
};

var move = function (mtx, entity) {
	var ent = cloneArray(entity);
	return ent;
};

/**
 * Converts entity into 
 * drawable data.
 *
 * @param object ent Entity object holding entity data.
 * @return object New object with entity's data in a drawable format.
 */
var drawable = function (ent) {
	var mtx = ent.pos;
	return {
		x: x(mtx),
		y: y(mtx),
		w: width(mtx),
		h: height(mtx),
		sx: ent.imgPos[0],
		sy: ent.imgPos[1],
		sw: width(mtx),
		sh: height(mtx),
		color: ent.color,
		image: ent.image,
	};
};

/**
 * A list of impure functions
 * that should be used sparingly.
 *
 * @type object
 */
var Impure = {
	/**
	 * Draws a shape on the canvas
	 * @param string shape Type of shape to draw.
	 * @param string fill Type of Image/color of the rendering fill. i.e. should the shape be filled by an image or a color specified in the data. 
	 * @param object data Object of data to draw.
	 * @param element canvas Canvas element on which to draw.
	 */
	draw: function (shape, fill, canvas, data) {

		var ctx = canvas.getContext('2d');
		var x = data.x;
		var y = data.y;
		var w = data.w;
		var h = data.h;
		var sX = data.sx;
		var sY = data.sy;
		var sW = data.sw;
		var sH = data.sh;
		var color = data.color;
		var image = data.image;

		// DRAW A RECTANGLE
		if (shape === 'rectangle') {

			ctx.beginPath();
			ctx.fillStyle = color;

			if (fill === 'color')
				ctx.fillRect(x,y,w,h);
			if (fill === 'image')
				ctx.drawImage(image, sX, sY, sW, sH, x, y, w, h);

			ctx.stroke();
		}
	},
	/**
	 * Draws all the entities on the HTML canvas.
	 */
	graphics: function (canvas, entities) {

		// CONVERT ENTITIES INTO DRAWABLE DATA
		var data = _.map(entities, drawable);

		// DRAW EACH DATA
		_.each(data, _.partial(Impure.drawImageRectangle, canvas));
	},
	/**
	 * Handles the logic of the game entities.
	 *
	 * @param element canvas An HTML5 canvas element.
	 * @param array entities An array of entity data objects.
	 * @return mixed False if the game should abort, an array of altered entities if it should continue.
	 */
	logic: function (canvas, entities) {

		// STOP GAME ON ESC PRESS
		if (KEY.isDown(27)) 
			return false;


		var ents = cloneArray(entities);
		var player = _.findWhere(ents, {id: "player"});

		if (KEY.isDown(68)) 
			player = move(player);

		return ents;
	},
	/**
	 * Ends game if bool is false.
	 *
	 * @param number interval The given interval to abort.
	 * @param boolean bool The boolean for which to test.
	 * @return undefined
	 */
	abort: function (interval, bool) {
		if (bool === false)
			clearInterval(interval);
	},
	/**
	 * Setup keyboard event listeners
	 * for the given element *cough*
	 * the canvas *cough*
	 *
	 * @param element el The element for which to setup keyboard event listeners.
	 * @return undefined
	 */
	setupEvents: function (el) {

		el.addEventListener('keydown', function (e) {

			e.preventDefault();

			KEY.onKeyDown( e.keyCode );
		});

		el.addEventListener('keyup', function (e) {

			e.preventDefault();

			KEY.onKeyUp( e.keyCode );
		});
	},
	/**
	 * Performs the basic game-loop
	 * 
	 * @param number interval The interval for this game function instance.
	 * @param element canvas Canvas to draw on.
	 * @param array entities Array of objects with matricies and an image.
	 * @return undefined
	 */
	game: function (fps, canvas, entities) {

		var ents = entities;
		var prevTime = _.now();

		canvas.setAttribute('tabIndex', 0);

		// SETUP CANVAS EVENT LISTENERS
		Impure.setupEvents( canvas );

		var interval = setInterval(function () {

			var delta = _.now() - prevTime;

			// THROTTLE FUNCTION AT FPS
			if (delta < 1000/fps)
				return;

			prevTime = _.now();

			// PERFORM LOGIC AND ABORT GAME WHEN FALSE RETURNED
			ents = Impure.logic(canvas, ents);
			Impure.abort(interval, ents);
			Impure.graphics(canvas, ents);
		}, 0);
	}
};

Impure.drawRectangle = _.partial(Impure.draw, 'rectangle', _, _, _);
Impure.drawColorRectangle = _.partial(Impure.drawRectangle, 'color', _, _);
Impure.drawImageRectangle = _.partial(Impure.drawRectangle, 'image', _, _);

