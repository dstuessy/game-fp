
/**
 * returns the first argument passed
 * "Taps" into the console whilst on
 * a chain of functions. Does not
 * mutate arguments passed. 
 * @param mixed arguments Any number of arguments to pass. 
 * @return mixed The arguments passed except the frst argument (the label for console log).
 */
var tapConsole = R.tap(function () {
	console.log.apply(console, arguments);
	return R.head(arguments);
});

var now = Date.now;

/**
 * A counter.
 * Starts at the given number.
 * Returns a function that 
 * can be 
 *
 * @example
 * var i = count(0)
 * i()
 * //=> 1
 * i()
 * //=> 2
 * i() 
 * //=> 3
 * @param number n The starting number for the counter
 * @return Function A counter function.
 */
var count = function (n) {

	var i = n;

	return function () {
		i++;
		return i;
	};
};

/**
 * Time Accumulator
 * Returns a function that executes
 * a passed function when called if the 
 * duration (n) has passed since the 
 * last time the timeAcc has been called.
 * @param number n Duration between function calls
 * @return function Function that is passed a function that is called if duration (n) has passed.
 */
var timeAccumulator = throttle = function (n) {
	var time = now();
	return function (fn) {
		var args = R.tail(arguments); // get arguments to pass to function
		if (now() - time >= n) { // execute function if duration passed
			time = now(); // reset time
			R.apply(fn, args); // execute function
		}
	};
};

/**
 * Shallow conversion of a 
 * array-like object into
 * an array.
 *
 * @param object list Array-like object
 * @return array Array version of the array-like object
 */
var toArray = R.into([], R.identity);

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
var flip = function (fn) {
	return R.curryN(fn.length, function () {
		var args = reverse(toArray(arguments));
		return R.apply(fn, args);
	});
};

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

var subtract = R.curry(function (b, a) {
	return a - b;
});

var multiply = R.curry(function (b, a) {
	return a * b;
});

var pow = R.curry(flip(Math.pow));

// SOME CURRIED UTIL FUNCTIONS 
// FOR MATH
var increment = incr = add(1);
var sum = R.reduce(add, 0);
var product = R.reduce(multiply, 1);
var squared = pow(2);

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

var test = [[1,2,3], [5,5,5], [6,6,6]];
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

var mergeBySum = mergeBy(add);

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

/**
 * Returns either a or b
 * where depending if it is not 
 * Nil (null/undefined).
 *
 * @param function fn Function to be executed if ifElse passes. 
 * @return function Function that takes two arguments for ifElse.
 */
var skipNil = R.ifElse(R.compose(isHeadNil, Array), R.compose(R.last, Array));

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
var reduceArraysByConcat = R.reduce(skipNil(R.compose(mergeByConcat, Array)), null);

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
Matrix.columns = unzip = R.compose( reduceArraysByConcat, splitEveryArray );

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
 * Adds two matricies together
 *
 * @param array a An array representing an entire matrix.
 * @param array b An array representing an entire matrix.
 * @return array A new array representing the summation of the passed matricies.
 */
Matrix.add = mergeBy(mergeBy(add));

/**
 * Subtracts two matricies from each other.
 * @param array a An array representing an entire matrix.
 * @param array b An array representing an entire matrix.
 * @return array A new array representing the subtraction of the passed matricies.
 */
Matrix.subtract = mergeBy(mergeBy(subtract));

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

var isPlayer = R.propEq('id', 'player');

var playerIndex = R.findIndex(isPlayer);

var findPlayer = getPlayer = R.find(isPlayer);

var playerLens = R.compose(R.lensIndex, playerIndex);

/**
 * Get player data
 * @param array entities Array of entity objects.
 * @return object A clone of the player object.
 */
var viewPlayer = function (entities) {
	return R.view(playerLens(entities), entities);
};

/**
 * Set player data
 * @param object player Object of player data
 * @param array entities Array of entity objects
 * @return array New array of entity objects with modified player data.
 */
var setPlayer = function (player, entities) {
	return R.set(playerLens(entities), player, entities);
};

// POSITION LENSES
var posLens = R.lensProp('pos');
var prevPosLens = R.lensProp('prevPos');
var walkSpeedLens = R.lensProp('walkSpeed');

// VIEW POSITIONS
var viewPos = R.view(posLens);
var viewPrevPos = R.view(prevPosLens);
var viewWalkSpeed = R.view(walkSpeedLens);

// SET POSITIONS
var setPos = R.set(posLens);
var setPrevPos = R.set(prevPosLens);
var setWalkSpeed = R.view(walkSpeedLens);

// DEFAULT PROPERTIES
// -- non-mutable
var Default = {
	prevPos: R.always([
		[0, 0], 
		[0, 0]
	]),
	walkSpeed: R.always( 5 )
};

/**
 * Translates the position of
 * a given entity by a given matrix.
 *
 * @param object entity An entity to translate.
 * @param array mtx A matrix by which to translate.
 * @return object New entity with modified "pos" property.
 */
var move = R.curry(function (mtx, entity) {
	entity = setPrevPos(viewPos(entity), entity);
	return setPos(Matrix.add(viewPos(entity), mtx), entity);
});

//var moveByVel = R.compose();

/**
 * Calculates the velocity of given entity
 * @param object entity Entity of which to calculate the velocity
 * @return array Array representing velocity as [x, y]
 */
var getVelocity = R.curry(function (entity) {
	var pos = viewPos(entity);
	var prevPos = viewPrevPos(entity) || Default.prevPos();
	return R.head(Matrix.subtract(prevPos, pos));
});

/**
 * Calculates the speed 
 * of a velocity vector.
 * Uses pythagoras a²+b²=c²
 *
 * @param array vel Velocity to convert to speed
 * @return number Speed of velocity.
 */
var getSpeed = R.curry(function (vel) {
	var x = R.head(vel);
	var y = R.last(vel);
	return Math.sqrt(squared(x) + squared(y));
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
	clearCanvas: function (canvas) {
		canvas.width = canvas.width;
	},
	/**
	 * Draws all the entities on the HTML canvas.
	 */
	graphics: R.curry(function (canvas, entities) {

		Impure.clearCanvas(canvas);

		// CONVERT ENTITIES INTO DRAWABLE DATA
		var data = R.map(drawable, entities);

		// DRAW DRAWABLE DATA
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
		if (KEY.isDown(KEY.ESC)) 
			return false;

		var ents = cloneArray(entities);
		var player = viewPlayer(ents);
		var walkSpeed = viewWalkSpeed(player);
		var velocity = getVelocity(player);
		var speed = getSpeed(velocity);
		var acc = (speed < walkSpeed) ? 0.5 : 0;
		var moveSpeed = speed + acc;

		console.log(walkSpeed);
		console.log(velocity);
		console.log(speed);

		ents = setPlayer(setPrevPos(viewPos(player), player), ents); // reset prev pos to current pos

		// MOVE PLAYER TO THE RIGHT
		if (KEY.isDown(KEY.D)) 
			ents = setPlayer(move([[moveSpeed,0], [moveSpeed,0]], player), ents);
		if (KEY.isDown(KEY.A))
			ents = setPlayer(move([[-moveSpeed,0], [-moveSpeed,0]], player), ents);

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
		return bool;
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
		var throttled = timeAccumulator(1000/fps); // throttle any given function to fps

		// APPLY FOCUS TO CANVAS ELEMENT
		canvas.setAttribute('tabIndex', 0);

		// SETUP CANVAS EVENT LISTENERS
		Impure.setupEvents( canvas );

		// BEGIN GAME LOOP
		var interval = setInterval(function () {

			// PERFORM LOGIC AND ABORT GAME WHEN FALSE RETURNED
			ents = Impure.logic(canvas, ents);
			// ABORT GAME LOOP IF GAME LOGIC RETURNS FALSY VALUE
			if (!Impure.abort(interval, ents))
				return;
			// THROTTLE GRAPHICS RENDERING
			throttled(Impure.graphics, canvas, ents);
		}, 10);
	})
};

Impure.drawRectangle = Impure.draw('rectangle');
Impure.drawColorRectangle = Impure.drawRectangle('color');
Impure.drawImageRectangle = Impure.drawRectangle('image');

