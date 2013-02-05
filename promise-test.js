// Tests pinkyswear.js with the Promises / A+ Test Suite (https://github.com/promises-aplus/promises-tests)
// Requires node.js installation.
// Run "npm install promises-aplus-tests" in this dir to install, and then run with "node promise-test.js"


var promisesAplusTests = require("promises-aplus-tests");

var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext(__dirname+"/pinkyswear.min.js");

console.log(pinkySwear);
console.log(pinkySwear());

var adapter = {
		fulfilled: function(value) { var p = pinkySwear(); p(true, [value]); return p; },
		rejected: function(reason) { var p = pinkySwear(); p(false, [reason]); return p;},
		pending: function() { 
			var p = pinkySwear();
			return {
				promise: p, 
				fulfill: function(value) {
					p(true, [value]);
				},
				reject: function(reason) {
					p(false, [reason]);
				}
			};
		}
	
};

promisesAplusTests(adapter, function (err) {
    console.log("Error: ", err);
});