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
 *          
 * 
 * https://github.com/timjansen/PinkySwear.js
 */
(function(target) {
	var undef; // remember current 'this'. required to call onFulfilled/onRehected as true functions 
	
	function isFunction(f) {
		return typeof f == 'function';
	}
	function isObject(f) {
		return typeof f == 'object';
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

		var set = function(newState, newValues) {
			if (state == null && newState != null) {
				var x = newValues[0], then, cbCalled=0; // TODO: test cbCalled as true/false
				try {
					
					if (newState && x!=null && (isFunction(x) || isObject(x)) && isFunction(then = x['then'])) {
						if (x === set)
							throw new TypeError();
						then.call(x, function(value) { if(!cbCalled++) set(true, [value]); }, function(value) { if(!cbCalled++) set(false, [value]); });
						return null;
					}
					else {
						state = newState;
						values = newValues;
					}
				}
				catch(e) {
					if(!cbCalled++) {
						state = false;
						values = [e];
					}
					else
						return;
				}
				if (deferred.length)
					defer(function() {
						for (var i = 0; i < deferred.length; i++)
							deferred[i]();
					});
			}
			return state;
		};
		
		set['then'] = function(onFulfilled, onRejected) {
			var promise2 = pinkySwear();
			var callCallbacks = function() {
				try {
					var f = (state ? onFulfilled : onRejected);
					if (isFunction(f))
						promise2(true, [f.apply(undef, values)]);
					else
						promise2(state, values);
				}
				catch (e) {
					promise2(false, [e]);
				}
			};
			if (state != null)
				defer(callCallbacks);
			else
				deferred.push(callCallbacks);    		
			return promise2;
		};

		// always(func) is the same as then(func, func)
		set['always'] = function(func) { return set['then'](func, func); };

		// error(func) is the same as then(0, func)
		set['error'] = function(func) { return set['then'](0, func); };
		return set;
	};
})(typeof module === 'undefined' ? [window, 'pinkySwear'] : [module, 'exports']);

