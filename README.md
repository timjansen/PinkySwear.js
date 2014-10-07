<a href="http://promisesaplus.com/">
    <img src="http://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.1 compliant" align="right" />
</a>
PinkySwear.js 2.2.2
====================

PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
Google Closure Compiler and gzipping it weighs less than 500 bytes. It is originally based on the implementation for 
<a href="http://minifiedjs.com">Minified.js</a> and is for embedding. In other words, you can use it as a
lightweight dependency for your library if you need to return a promise. It is not intended as a stand-alone
library for more complex applications, and therefore does not support assimilation of other promises.
Minified's implementation does support assimilation though.
 
## Release History ##

#####Version 2.2.2 released July 30, 2014
- Support extensions for promises created using then() (thanks, Zbyszek Tenerowicz)

#####Version 2.2.1 released July 17, 2014
- Added extend function to constructor (thanks, Zbyszek Tenerowicz)

#####Version 2.1 released June 6, 2014
- Removed always() and error(), since they were not in the spirit of a minimal implementation.
- Updated Promises/A+ Compliance Test to 2.0.4

#####Version 2.0.2, released May 10, 2014
- Use setImmediate() on platforms that support it (thanks, Carl-Erik Kopseng)

#####Version 2.0.1, released Apr 3, 2014
- Fixed PinkySwear on IE8 which can't handle apply() without arguments (thanks, Luis Nabais)
- Fix and test case for PinkySwear's multi-arguments extension (thanks, Carl-Erik Kopseng)

#####Version 2.0, released Feb 10, 2014
Passes Promises/A+ Compliance Test 2.0.3. Allows obtaining state by calling promise function without arguments.

#####Version 1.0, released Feb 09, 2013
First release. Passes Promises/A+ Compliance Test 1.10.0 with one exception (PinkySwear is function-based, which is
allowed in the spec, but not in the old test suite).
 
 
## Stats ##

<table>
<tr><th>Name</th><th>Type</th><th>Size</th></tr>
<tr><td>pinkyswear.js</td><td>Source code</td><td>about 4kB</td></tr>
<tr><td>pinkyswear.min.js</td><td>Closure /w Advanced Optimization</td><td>828 bytes</td></tr>
<tr><td>pinkyswear.min.js.gz</td><td>Closure + GZip'd</td><td>470 bytes</td></tr>
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
 
PinkySwear has just three functions.

To create a new promise in pending state, call pinkySwear():
>         var promise = pinkySwear();
 
The returned object has a Promises/A+ compatible then() implementation:
>         promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
 
The promise returned by pinkySwear() is a function itself. To fulfill the promise, call the function with true as first argument and
an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
value to the then() handlers. Here an example to fulfill a promise, this time with only one argument: 
>         promise(true, [42]);
 
When the promise has been rejected, call it with false as first argument:
>         promise(false, [6, 6, 6]);

You can obtain the promise's current state by calling the function without arguments. It will be true if fulfilled,
false if rejected, and otherwise undefined.
>		  var state = promise();

It is possible to extend PinkySwear's promise object with custom methods by specifying an extend function:
>         function addHello(prom) { 
>             prom.sayHello = function() { console.log('hello'); }; 
>             return prom; 
>         }
>         var promise = pinkySwear(addHello);

## Examples ##
### setTimeout ###
A PinkySwear-powered timeout function that returns a promise:
>         function promiseTimeout(timeoutMs) {
>             var prom = pinkySwear();
>             setTimeout(function() {
>                 prom(true, []);
>             }, timeoutMs);
>             return prom; 
>         }

Using the timeout:
>         console.log('Starting timeout now.');
>         promiseTimeout(5000).then(function() {
>             console.log('5s have passed.');
>         });

### XmlHttpRequest ###
This is a simple implementation of HTTP GET requests in browsers using XmlHttpRequest. It returns a promise with the result or failure:
>        function get(url) {
>            var prom = pinkySwear();
>            var xhr = new XMLHttpRequest();
>            xhr.onreadystatechange = function() {
>                if (xhr.readyState==4 && xhr.status==200)
>                    prom(true, [xhr.status, xhr.responseText]);
>                else 
>                    prom(false, [xhr.status, xhr.statusText, xhr.responseText]);
>            };
>            oReq.open('get', url, true);
>            oReq.send();
>            return prom;
>        }

This is how to retrieve a simple file:
>        get('http://example.com/someFile.txt').then(function(status, txt) {
>            console.log('Got my file: ', txt);
>            return get('http://example.com/fileTwo.txt');
>        }, function(status, statusText, txt) {
>            console.log('Something bad happened. Got status code: ', status, statusText);
>        });


This example retrieves a file, waits 3s and gets a second one:
>        get('http://example.com/fileOne.txt').then(function(status, txt) {
>            console.log('Got first file: ', txt);
>            return promiseTimeout(3000);
>        }).then(function() {
>            console.log('Waited 3s');
>            return get('http://example.com/fileTwo.txt');
>        }).then(function(status, txt) {
>            console.log('Got second file: ', txt);
>        }).then(null, function() {
>            console.log('Something bad happened along the way.');
>        });


## Licensing ##

Public Domain. Use, modify and distribute it any way you like. No attribution required.
To the extent possible under law, Tim Jansen has waived all copyright and related or neighboring rights to PinkySwear.
Please see http://creativecommons.org/publicdomain/zero/1.0/
