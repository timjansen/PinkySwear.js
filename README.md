PinkySwear.js
==============

PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
Google Closure Compiler and gzipping it weighs less than 400 bytes. It is based on the implementation for 
my upcoming library Minified.js and should be perfect for embedding.
 
 
## Stats ##

<table>
<tr><th>Name</th><th>Type</th><th>Size</th></tr>
<tr><td>pinkyswear.js</td><td>Source code</td><td>3610 bytes</td></tr>
<tr><td>pinkyswear.min.js</td><td>Closure /w Advanced Optimization</td><td>671 bytes</td></tr>
<tr><td>pinkyswear.min.js.gz</td><td>Closure + GZip'd</td><td>375 bytes</td></tr>
</table>


## How to Include / Node.js ##

You can install PinkySwear.js using npm:
> npm install pinkyswear

Use require() to get the initial function:
> var pinkySwear = require('pinkyswear');


## How to Include / Browser ##

To use PinkySwear in a browser, just include it with a script tag. You probably want to use the minified version in a browser:
> &lt;script type="text/javascript" src="path/to/pinkyswear.min.js">&lt;/script>

 
## API ##
 
PinkySwear has just five functions.

To create a new promise in pending state, call pinkySwear():
>         var promise = pinkySwear();
 
The returned object has a Promises/A+ compatible then() implementation:
>         promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
 
The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
value to the then() handlers. Here an example to fulfill a promise, this time with only one argument: 
>         promise(true, [42]);
 
When the promise has been rejected, call it with false as first argument:
>         promise(false, [6, 6, 6]);
 
PinkySwear has two convenience functions. always(func1) is the same as then(func1, func1) and thus will always be called, no matter what the
promises final state is:
>         promise.always(function(value) { alert("Done!"); });
 
error(func) is the same as then(0, func), and thus the handler will only be called on error:
>         promise.error(function(value) { alert("Failure!"); });
