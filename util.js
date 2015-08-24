
var now = Date.now;

var count = function (n) {

	var i = n;

	return function () {
		i++;
		return i;
	};
};


/**
 * Call a function every n number
 * of executions.
 *
 * @param number n Number of executions for given function.
 * @param function fn Function to be called after n number of executions.
 * @return function Function that will execute fn after n number of executions. 
 */
var callEvery = R.curry(function (n, fn) {
	var i = count(0);
	return function () {
		if (i() == n) {
			i = count(0);
			return R.apply(fn, arguments);
		}
	};
});

/**
 * Iterates over an array 
 * by every n entries. 
 * Passes n number of 
 * arguments to the 
 * given function.
 *
 * @see mapEvery()
 * @param number n The number by which to map.
 * @param function fn The function by which to map.
 * @param array array The array to map.
 * @return array Mapped array.
 */
var forEvery = R.curry(function (n, fn ,array) {

	var i = count(0);
	var args = [];
	var func = callEvery(n, function () {
		// execute fn 
		R.apply(fn, args);
		// clear args 
		args = [];
	});

	// ITERATE THROUGH ARRAY
	R.forEach(function (val) {
		
		// LOAD val TO args
		args = R.insert(R.length(args), val, args);

		// APPLY args TO fn
		func();
	}, array);
});

/**
 * Maps an array by every n
 * entries. Passes n number
 * of arguments to the 
 * given function.
 *
 * @example
 * mapEvery(2, Array, [1,2,3,4,5,6])
 * //=> [[1,2,3],[4,5,6]]
 * @param number n The number by which to map.
 * @param function fn The function by which to map.
 * @param array array The array to map.
 * @return array Mapped array.
 */
var mapEvery = R.curry(function (n, fn, array) {

	var i = count(0);
	var rtrn = [];
	var args = [];
	var func = callEvery(n, function () {
		// execute fn 
		rtrn = R.insert(R.length(rtrn), R.apply(fn, args), rtrn);
		// clear args 
		args = [];
	});

	// ITERATE THROUGH ARRAY
	R.forEach(function (val) {
		
		// LOAD val TO args
		args = R.insert(R.length(args), val, args);

		// APPLY args TO fn
		func();
	}, array);

	return rtrn;
});

/**
 * Shallow clones an array
 * Returns a new array comprising of the
 * same values.
 *
 * @param array array Array to be cloned.
 * @return array New array of cloned array.
 */
var cloneArray = R.curry(function (array) {
	return [].concat(array);
});

/**
 * Get current time in milliseconds 
 * since the year 1970, 1 January, 00:00:00 AM UTC
 * @return number Current time in milliseconds
 */
var now = Date.now;

/**
 * Reverse given array.
 * @param array array Array to be reversed.
 * @return array Reversed array.
 */
var reverse = R.curry(function (array) {
	return array.reverse();
});

/**
 * Flip the order the arguments are
 * passed to the given function.
 *
 * @param function fn Function for which arguments should be reversed
 * @return function New Function with reversed arguments.
 */
var flip = R.curry(function (fn) {

	return function () {

		var args = reverse(toArray(arguments));

		return fn.apply(null, args);
	};
});

/**
 * R.compose(R.map(R.flatten), R.apply(R.zip), R.map(R.splitEvery(1)))( [[1,2,3],[2,2,2],[3,3,3]] )
 * 
 */
var unzip = R.apply(R.zip);

var y = R.curry(function (mtx) {
	return mtx[0][1];
});

var x = R.curry(function (mtx) {
	return mtx[0][0];
});

/**
 * Returns the calculated y
 * displacement of a 2d matrix.
 *
 * @param array mtx An array representing a matrix ( see Matrix function below )
 * @return number The y-displacement of the given 2d matrix.
 */
var height = R.curry(function (mtx) {
	return mtx[1][1] - mtx[0][1];
});

/**
 * Returns the calculated 
 * x-displacement of a 2d matrix.
 *
 * @param array mtx An array representing a matrix (see Matrix funciton below)
 * @return number The x-displacement of the given 2d matrix.
 */
var width = R.curry(function (mtx) {
	return mtx[1][0] - mtx[0][0];
});

var add = R.curry(function (b, a) {
	return a + b;
});

var multiply = R.curry(function (b, a) {
	return a * b;
});

var increment = incr = add(1);
var sum = R.reduce(add, 1);

/**
 * Generates an array of
 * 'n' numbers starting from one
 * to 'n'.
 *
 * @param number n The length of array.
 * @return array New array consisting of 'n' entries.
 */
var numbers = R.compose(R.range(1), incr);

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
var mapSum = R.map(sum);

var test = [[1,2,3], [5,5,5]];
var test2 = [[3,3,3], [2,2,2], [1,1,1]];

/**
 * Returns the product of 
 * merging two arrays into 
 * one, using a given function.
 *
 * i.e. merge two arrays of numbers 
 * with a function of addition to 
 * calculate the addition of each entry
 * in both arrays in parallel 
 * positions.
 *
 * @example
 * mergeBy(add, [1,2,3], [2,2,2]) 
 * //=> [1+2, 2+2, 3+2];
 * @param function fn A function with which to merge the arrays.
 * @param array arr An array to be merged
 * @param array arr2 Another array to be merged
 * @return array The product of the merged arrays.
 */
var mergeBy = R.curry(function (fn, arr, arr2) {
	var i = 0;
	return R.map(function (a) {
		var b = arr2[i];
		i++;
		return fn(b, a);
	}, arr);
});

/**
 * Merge arrays by multiplication.
 *
 * @param array a Array to be merged with another.
 * @param array b Array to be merged with another.
 * @return array New array where its entries are the products of multiplication for each entry of the source arrays.
 */
var mergeByMult = mergeBy(multiply);

var zipWithConcat = R.zipWith(R.concat);

var mergeByConcat = unzipWithConcat = R.apply(zipWithConcat);

var isHeadNil = R.compose(R.isNil, R.head);

var splitEveryArray = R.map(R.splitEvery(1));


/**
 * Reduces an array of arrays
 * by concatenating the lowest
 * level of the array.
 *
 * The array must consist
 * of arrays where each entry is
 * an array itself.
 *
 * @example
 * [[1,2,3],[2,2,2],[3,3,3]] //=> [[1,2,3,2,2,2,3,3,3]]
 * or 
 * [[[1],[2],[3]], [[2],[2],[2]], [[3],[3],[3]] //=> [[1,2,3], [2,2,3], [3,2,3]]
 * @param array Array An array of arrays of arrays to be reduced via concatentation.
 * @return array A new array with each value of each index grouped by array.
 */
var reduceArraysByConcat = R.reduce(R.compose( R.ifElse( isHeadNil, R.last, mergeByConcat ), Array), null);

/**
 * Converts arguments into
 * a matrix, where each 
 * argument is an array 
 * representing a row of the
 * matrix.
 *
 * @param array row A row of the matrix.
 * @return array A new matrix, where each entry is an array representing a row of the matrix.
 */
var Matrix = Array;

Matrix.I = R.curry(function (n) {
	return R.map(function (v, i) {
		return (v == v);
	}, numbers(n));
});

/**
 * Converts the matrix 
 * (an array of rows) into
 * an array of columns.
 *
 * @param array array A matrix.
 * @return array An array of columns.
 */
Matrix.columns = R.compose( reduceArraysByConcat, splitEveryArray );

/**
 * Multiplies the given row 
 * of a matrix by each column 
 * of a given matrix.
 *
 * @param array a An array representing values of one row of a matrix.
 * @param array b An array representing an entire matrix with arrays as rows of its values.
 * @return array A new array representing a matrix as the product of the multiplication.
 */
Matrix.multRowbyCols = R.curry(function (b, a) {
	return R.map(mergeByMult(a), Matrix.columns(b));
});

/**
 * Multiplies two matrixes.
 *
 * @param array a An array representing an entire matrix, where arrays are rows of values.
 * @param array b An array representing an entire matrix, where arrays are rows of values.
 * @return array A new array representing a matrix as the product of the multiplication of the other two.
 */
Matrix.multiply = R.curry(function (a, b) {
	return R.map(R.compose(mapSum, Matrix.multRowbyCols(b)), a);
});

/**
 * Transform a matrix.
 *
 * Is the same as matrix multiplication.
 * Transoformation is the product 
 * of a matrix and a given transformation
 * matrix. Transformation matricies are 
 * like any other matrix, only that
 * when multiplying them by another matrix, 
 * the other matrix would have changed
 * in a desired maner.
 *
 * @param array transform Transformation matrix.
 * @param array matrix Matrix to be transformed.
 * @return array Transformed matrix.
 */
Matrix.transform = Matrix.multiply;


var move = R.curry(function (mtx, entity) {
	var ent = cloneArray(entity);
	return ent;
});

/**
 * Converts entity into 
 * drawable data.
 *
 * @param object ent Entity object holding entity data.
 * @return object New object with entity's data in a drawable format.
 */
var drawable = R.curry(function (ent) {
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
});

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
	draw: R.curry(function (shape, fill, canvas, data) {

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
	}),
	/**
	 * Draws all the entities on the HTML canvas.
	 */
	graphics: R.curry(function (canvas, entities) {

		// CONVERT ENTITIES INTO DRAWABLE DATA
		var data = R.map(drawable, entities);

		// DRAW EACH DATA
		R.forEach(Impure.drawImageRectangle(canvas), data);
	}),
	/**
	 * Handles the logic of the game entities.
	 *
	 * @param element canvas An HTML5 canvas element.
	 * @param array entities An array of entity data objects.
	 * @return mixed False if the game should abort, an array of altered entities if it should continue.
	 */
	logic: R.curry(function (canvas, entities) {

		// STOP GAME ON ESC PRESS
		if (KEY.isDown(27)) 
			return false;


		var ents = cloneArray(entities);
		var player = R.find(R.propEq('id', 'player'), ents);

		if (KEY.isDown(68)) 
			player = move(player);

		return ents;
	}),
	/**
	 * Ends game if bool is false.
	 *
	 * @param number interval The given interval to abort.
	 * @param boolean bool The boolean for which to test.
	 * @return undefined
	 */
	abort: R.curry(function (interval, bool) {
		if (bool === false)
			clearInterval(interval);
	}),
	/**
	 * Setup keyboard event listeners
	 * for the given element *cough*
	 * the canvas *cough*
	 *
	 * @param element el The element for which to setup keyboard event listeners.
	 * @return undefined
	 */
	setupEvents: R.curry(function (el) {

		el.addEventListener('keydown', function (e) {

			e.preventDefault();

			KEY.onKeyDown( e.keyCode );
		});

		el.addEventListener('keyup', function (e) {

			e.preventDefault();

			KEY.onKeyUp( e.keyCode );
		});
	}),
	/**
	 * Performs the basic game-loop
	 * 
	 * @param number interval The interval for this game function instance.
	 * @param element canvas Canvas to draw on.
	 * @param array entities Array of objects with matricies and an image.
	 * @return undefined
	 */
	game: R.curry(function (fps, canvas, entities) {

		var ents = entities;
		var prevTime = now();

		canvas.setAttribute('tabIndex', 0);

		// SETUP CANVAS EVENT LISTENERS
		Impure.setupEvents( canvas );

		var interval = setInterval(function () {

			var delta = now() - prevTime;

			// THROTTLE FUNCTION AT FPS
			if (delta < 1000/fps)
				return;

			prevTime = now();

			// PERFORM LOGIC AND ABORT GAME WHEN FALSE RETURNED
			ents = Impure.logic(canvas, ents);
			Impure.abort(interval, ents);
			Impure.graphics(canvas, ents);
		}, 0);
	})
};

Impure.drawRectangle = Impure.draw('rectangle');
Impure.drawColorRectangle = Impure.drawRectangle('color');
Impure.drawImageRectangle = Impure.drawRectangle('image');

