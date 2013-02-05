PinkySwear.js
==============

PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
Google Closure Compiler and gzipping it weighs less than 350 bytes. It is based on the implementation for 
my upcoming library Minified.js and should be perfect for embedding.
 
 
## Stats ##

<table>
<tr><th>Name</th><th>Source code</th><th>Closure / Advanced Optimization</th><th>Compiled + GZip'd</th></tr>
<tr><td>pinkyswear.js</td><td>3498 bytes</td><td>575 bytes</td><td>378 bytes</td></tr>
</table>
 
 
## API ##
 
PinkySwear has just four functions.

To create a new promise in pending state, call pinkySwear():
>         var promise = pinkySwear();
 
The returned object has a Promises/A+ compatible then() implementation:
>         promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
 
The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
value to the then() handlers. Here an example to fulfill a promsise, this time with only one argument: 
>         promise(true, [42]);
 
When the promise has been rejected, call it with false. Again, there may be more than one argument for the then() handler:
>         promise(true, [6, 6, 6]);
 
PinkySwear has two convenience functions. always(func) is the same as then(func, func) and thus will always be called, no matter what the
promises final state is:
>         promise.always(function(value) { alert("Done!"); });
 
error(func) is the same as then(0, func), and thus the handler will only be called on error:
>         promise.error(function(value) { alert("Failure!"); });
