var TemplateBase = require("../lib/template-base.js").TemplateBase;
var path = require('path');
var fs = require('fs');
var npm = require("npm");
var Q = require('q');
var exec = require('../lib/exec');

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

            var args = ["install"];
            if (config.production) {
                args.push("--production");
            }
            if (config.production) {
                args.push("--" + config.loglevel);
            }

            return exec("npm", args, config.prefix);
        }
    },

    defaultPackageHome: {
        value: function (value) {
            return process.cwd()
        }
    }

});
