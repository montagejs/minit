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
var Q = require("q");
var Path = require("path");

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "jasmine spec including boilerplate for a test page."
    },

    addOptions: {
        value:function (command) {
            command = TemplateBase.addOptions.call(this, command);
            command.option('-n, --name <name>', 'module name');
            command.option('-t, --title [name]', 'title of the test');
            return command;
        }
    },

    destinationOptionDescription: {
        value: "where the template will be expanded relative to the package-home's test directory"
    },

    didSetOptions: {
        value:function (options) {
            if (!options.title && options.name) {
                options.title = options.name.replace(/(?:^|-)([^-])/g, function(match, g1) { return g1.toUpperCase() });
            }
            if (options.name) {
                options.propertyName = options.name.replace(/(?:-)([^-])/g, function(match, g1) { return g1.toUpperCase() });
            }
        }
    },

    destination: {
        value: "ui"
    },

    finalDestination: {
        get: function() {
            return Path.join(this.options.packageHome, "test", this.options.destination)
        }
    },

    finish: {
        value: function() {
            var self = this;
            return TemplateBase.finish.call(this).then(function(result) {
                var message = ['add "test',self.options.destination,self.options.name,self.options.name + '-spec" to test/all.js '].join(Path.sep);
                console.log(message);
                return Q.resolve(message);
            });
        }
    }

});
