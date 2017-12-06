"use strict";

var jasmine = require('jasmine-node');
var path = require('path');
var Q = require("q");

//for(var key in jasmine) {
//  global[key] = jasmine[key];
//}

var isVerbose = true;
var showColors = true;
var junitreport = {
    report: false,
    savePath: path.join(__dirname, "junitreport/"),
    consolidate: true,
    useDotNotation: false
};

process.argv.forEach(function(arg){
    switch(arg) {
          case '--color': showColors = true; break;
          case '--noColor': showColors = false; break;
          case '--verbose': isVerbose = true; break;
          case '--junit': junitreport.report = true; break;
      }
});

/**
 * from https://github.com/kriskowal/q-io/blob/master/spec/lib/jasmine-promise.js
 */
jasmine.Block.prototype.execute = function (onComplete) {
    var spec = this.spec;
    try {
        var result = this.func.call(spec, onComplete);

        // It seems Jasmine likes to return the suite if you pass it anything.
        // So make sure it's a promise first.
        if (result && typeof result.then === "function") {
            Q.timeout(result, 500).then(function () {
                onComplete();
            }, function (error) {
                spec.fail(error);
                onComplete();
            });
        } else if (this.func.length === 0) {
            onComplete();
        }
    } catch (error) {
        spec.fail(error);
        onComplete();
    }
};


jasmine.executeSpecsInFolder({
    "specFolders": [__dirname+ "/test"],
    "onComplete": function(runner/*, log*/){
      if (runner.results().failedCount === 0) {
        process.exit(0);
      }
      else {
        process.exit(1);
      }
    },
    "isVerbose": isVerbose,
    "showColors": showColors,
    "junitreport": junitreport
});
