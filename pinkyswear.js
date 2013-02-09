/*
 * PinkySwear.js - Minimalistic implementation of the Promises/A+ spec
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
 * Google Closure Compiler and gzipping it weighs less than 350 bytes. It is based on the implementation for 
 * my upcoming library Minified.js and should be perfect for embedding.
 *
 *
 * PinkySwear has just four functions.
 *
 * To create a new promise in pending state, call pinkySwear():
 *         var promise = pinkySwear();
 *
 * The returned object has a Promises/A+ compatible then() implementation:
 *          promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
 *
 *
 * The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
 * an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
 * value to the then() handlers. Here an example to fulfill a promsise, this time with only one argument: 
 *         promise(true, [42]);
 *
 * When the promise has been rejected, call it with false. Again, there may be more than one argument for the then() handler:
 *         promise(true, [6, 6, 6]);
 *
 * PinkySwear has two convenience functions. always(func) is the same as then(func, func) and thus will always be called, no matter what the
 * promises final state is:
 *          promise.always(function(value) { alert("Done!"); });
 *
 * error(func) is the same as then(0, func), and thus the handler will only be called on error:
 *          promise.error(function(value) { alert("Failure!"); });
 */
(function(target) {
	function isFunction(f,o) {
		return typeof f == 'function';
	}
	function defer(callback) {
		if (typeof process != 'undefined' && process['nextTick'])
			process['nextTick'](callback);
		else
			window.setTimeout(callback, 0);
	}
	
	target[0][target[1]] = function pinkySwear() {
		var state;           // undefined/null = pending, true = fulfilled, false = rejected
		var values = [];     // an array of values as arguments for the then() handlers
		var deferred = [];   // functions to call when set() is invoked
			
		var set = function promise(newState, newValues) {
			if (state == null) {
				state = newState;
				values = newValues;
				defer(function() {
					for (var i = 0; i < deferred.length; i++)
						deferred[i]();
				});
			}
		};
		set['then'] = function(onFulfilled, onRejected) {
			var newPromise = pinkySwear();
			var callCallbacks = function() {
				try {
					var f = (state ? onFulfilled : onRejected);
					if (isFunction(f)) {
						var r = f.apply(null, values);
						if (r && isFunction(r['then']))
							r['then'](function(value){newPromise(true,[value]);}, function(value){newPromise(false,[value]);});
						else
							newPromise(true, [r]);
					}
					else
						newPromise(state, values);
				}
				catch (e) {
					newPromise(false, [e]);
				}
			};
			if (state != null)
				defer(callCallbacks);
			else
				deferred.push(callCallbacks);    		
			return newPromise;
		};

		// always(func) is the same as then(func, func)
		set['always'] = function(func) { return set['then'](func, func); };

		// error(func) is the same as then(0, func)
		set['error'] = function(func) { return set['then'](0, func); };
		return set;
	};
})(typeof module === 'undefined' ? [window, 'pinkySwear'] : [module, 'exports']);

