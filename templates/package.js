var TemplateBase = require("../lib/template-base").TemplateBase;
var path = require('path');
var fs = require('fs');
var NpmWrapper = require("../lib/npm-wrapper");
var Q = require('q');
var http = require("http");

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
                if (self.options.npmCache) {
                    config.cache = self.options.npmCache;
                }
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

    /**
     * Performs a HEAD request on `registry.npmjs.org` to check if the user
     * and registry are online and available.
     * @function
     * @returns {Promise.<boolean>} `true` if the npm registry can be reached,
     * `false` otherwise
     */
    _isOnline: {
        value: function () {
            var isOnline = Q.defer();

            var req = http.request({
                hostname: "registry.npmjs.org",
                method: "HEAD"
            }, function (res) {
                // Listen to the data event so that the response stream can
                // start, but we actually don't care about the response
                res.on("data", function () {});

                if (res.statusCode === 200) {
                    isOnline.resolve(true);
                } else {
                    isOnline.resolve(false);
                }
            });
            req.on("error", function (error) {
                isOnline.resolve(false);
            });
            req.end();

            return isOnline.promise;
        }
    },

    installDependencies: {
        value: function (config) {
            return this._isOnline()
            .then(function (isOnline) {
                var npm;
                if (isOnline) {
                    npm = new NpmWrapper(config);
                } else {
                    // If we're not online then set the registry to null which
                    // prevents any contact with the outside world
                    config = Object.create(config);
                    config.registry = null;
                    npm = new NpmWrapper(config);
                }

                return npm.install()
                .finally(function () {
                    return npm.close();
                });
            });
        }
    },

    defaultPackageHome: {
        value: function (value) {
            return process.cwd();
        }
    }

});
