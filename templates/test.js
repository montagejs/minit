/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

var TemplateBase = require("../lib/template-base.js").TemplateBase;
var childProcess = require('child_process');
var Q = require("q");

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "jasmine spec"
    },

    addOptions: {
        value:function (command) {
            command.option('-n, --name <name>', 'module name');
            command.option('-t, --title [name]', 'title of the test');
            return command;
        }
    },

    didSetOptions: {
        value:function (options) {
            if (!options.title && options.name) {
                options.title = options.name.replace(/(?:^|-)([^-])/g, function(_, g1) { return g1.toUpperCase() });
            }
        }
    },

    destination: {
        value: "test/ui/"
    },

    finish: {
        value: function() {
            return TemplateBase.finish.call(this).then(function(result) {
                console.log("Direct Link:");
                var url = "http://localhost:8081/montage/test/run.html?spec=ui%2F" + this.options.name + "-spec";
                console.log(url);
                // intentionally ignore failure
                var done = Q.defer();
                childProcess.exec("open " + url, function () {
                    done.resolve("open " + url);
                });
                return done.promise;
            });
        }
    }

});
