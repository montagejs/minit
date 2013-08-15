var TemplateBase = require("../lib/template-base.js").TemplateBase;
var path = require('path');
var fs = require('fs');
var npm = require("npm");
var Q = require('q');

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "package"
    },

    addOptions: {
        value:function (command) {
            command = TemplateBase.addOptions.call(this, command);
            command.option('-n, --name <name>', 'package name');
            command.option('-c, --copyright [path]', 'copyright file');
            return command;
        }
    },

    didSetOptions: {
        value:function (options) {
            if (options.copyright) {
                options.copyright = this.validateCopyright(options.copyright);
            }
        }
    },

    validateCopyright: {
        value: function(path) {
            return fs.readFileSync(path, "utf-8");
        }
    },

    finish: {
        value: function(destination) {
            var self = this;
            return TemplateBase.finish.call(this).then(function(result) {
                var config = {
                    prefix : path.join(destination, self.options.name),
                    production : true,
                    loglevel: "warn"
                };
                return self.installDependencies(config);
            }).then(function() {
                console.log("#");
                console.log("# "+ self.options.name +" created and installed with production dependencies, run");
                console.log("# > npm install .");
                console.log("# to setup the testing dependencies");
                console.log("#");
            });
        }
    },

    installDependencies: {
        value: function (config) {
            return Q.ninvoke(npm, "load", (config || null))
                .then(function () {

                    // npm is a singleton within a process; loading with a
                    // new config does not appear to update the configuration
                    // in particular, the prefix from the original configuration
                    // is always used npm.config.set and other approaches
                    // do not end up with a change to the necessary npm.dir
                    // or npm.globalDir.
                    // Changing npm.prefix directly here does work, though
                    // if the configuration differed in other ways those might
                    // need to be manually set directly on npm as well

                    if (config.prefix) {
                        npm.prefix = config.prefix;
                    }

                    return Q.ninvoke(npm.commands, "install");
                });
        }
    },

    defaultPackageHome: {
        value: function (value) {
            return process.cwd()
        }
    }

});
