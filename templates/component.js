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
var fs = require('fs');

var Command = require("commander").Command;

var _firstCapRe = new RegExp('(.)([A-Z][a-z]+)');
var _allCapRe = new RegExp('([a-z0-9])([A-Z])');
var _fromCamelToDashes = function (name){
        var s1 = name.replace(_firstCapRe, "$1-$2");
        return s1.replace(_allCapRe, "$1-$2").toLowerCase();
    };

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "component"
    },

    addOptions: {
        value:function (command) {
            command.option('-n, --name <name>', 'module name');
            command.option('-e, --exported-name [name]', 'exported name');
            command.option('-j, --jsdoc [module]', 'jsdoc module');
            command.option('-c, --copyright [path]', 'copyright file');
            return command;
        }
    },

    didSetOptions: {
        value:function (options) {
            if (options.name) {
                options.name = this.validateName(options.name);
            }
            if (!options.exportedName) {
                options.exportedName = this.validateExport(options.name);
            }
            if (options.jsdoc) {
                options.jsdoc = this.validateJsdoc(options.jsdoc);
            }
            if (options.copyright) {
                options.copyright = this.validateCopyright(options.copyright);
            }

        }
    },

    validateName: {
        value: function(name) {
           var exportedName = this.validateExport(name);
            // convert back from camelcase to dashes
            return _fromCamelToDashes(exportedName);
        }
    },

    validateExport: {
        value: function(name) {
            // We accept the name in any format, dashed, spaced or camelcased
            // We then convert to to camelcase and back to get the consistent
            // naming used in Montage
            // remove spaces
            name = name.replace(" ", "-");
            // convert to camelcase
            return name.replace(/(?:^|-)([^\-])/g, function(_, g1) { return g1.toUpperCase(); });
        }
    },

    validateJsdoc: {
        value: function(jsdocModule) {
            if (jsdocModule.length && jsdocModule.substring(jsdocModule.length - 1) !== "/") {
                return jsdocModule += "/";
            }
            return jsdocModule;
        }
    },

    validateCopyright: {
        value: function(path) {
            return fs.readFileSync(path, "utf-8");
        }
    },

    destination: {
        value: "ui"
    },

    finish: {
        value: function() {
            var self = this;
            return TemplateBase.finish.apply(this, arguments).then(function(result) {
                console.log(self.options.name + ".reel created.");
                return result;
            });
        }
    }

});
