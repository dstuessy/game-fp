
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
	return a + b;
};

var multiply = function (a, b) {
	return a * b;
};

var sum = _.partial(_.foldl, _, add, 0);

/**
 * Maps each entry in an array
 * to a sum of its constituents,
 * where each entry is an array.
 *
 * i.e. [
 *		[1,2,3],
 *		[2,2,2]
 * ]
 *
 * into 
 *
 * [
 *		6,
 *		6
 * ]
 *
 * @param array a Array to be mapped to its constituents' sums.
 * @return array New array with entries of the old array's constituents' sums.
 */
var mapSum = _.partial(_.map, _, sum);

var test = [[1,2,3], [5,5,5]];
var test2 = [[3,3,3], [2,2,2], [1,1,1]];

var merge = function (arr, arr2, fn) {
	return _.map(arr, function (a, i) {
		var b = arr2[i];
		return _.bind(fn, this, a, b)();
	}.bind(this));
};

/**
 * Merge arrays by multiplication.
 *
 * @param array a Array to be merged with another.
 * @param array b Array to be merged with another.
 * @return array New array where its entries are the products of multiplication for each entry of the source arrays.
 */
var mergeByMult = _.partial(merge, _, _, multiply);

var Matrix = {
	columns: _.partial(_.unzip, _),
	/**
	 * Multiplies the given row 
	 * of a matrix by each column 
	 * of another given matrix.
	 *
	 * @param array a An array representing values of one row of a matrix.
	 * @param array b An array representing an entire matrix with arrays as rows of its values.
	 * @return array A new array representing a matrix as the product of the multiplication.
	 */
	multRbyCs: function (a, b) {
		return _.map(Matrix.columns(b), _.partial(mergeByMult, a, _));
	},
	/**
	 * Multiplies two matrixes.
	 *
	 * @param array a An array representing an entire matrix, where arrays are rows of values.
	 * @param array b An array representing an entire matrix, where arrays are rows of values.
	 * @return array A new array representing a matrix as the product of the multiplication of the other two.
	 */
	multiply: function (a, b) {
		return _.map(a, _.compose(mapSum, _.partial(Matrix.multRbyCs, _, b)));
	}
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

