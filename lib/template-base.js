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

var Path = require("path");
var Mustache = require("./mustache");
var FS = require("fs");
var Q = require("q");
var qfs = require("q-io/fs");
var os = require("os");

var MinitError = require("./error").MinitError;

var FILENAME_VARIABLE_START = "__";
var FILENAME_VARIABLE_END = "__";

exports.TemplateBase = Object.create(Object.prototype, {

    addOptions: {
        value: function (command) {
            command.option('-p, --package-home [path]',"absolute path to the package's home directory", this.validatePackageHome, this.defaultPackageHome());
            command.option('-d, --destination [path]', this.destinationOptionDescription, Path.join);
            return command;
        }
    },

    destinationOptionDescription: {
        value: 'where the template will be expanded relative to the package-home'
    },

    newWithDirectory: {
        value: function(directory) {
            var newTemplate = Object.create(this);
            newTemplate.directory = directory;
            return newTemplate;
        }
    },

    validatePackageHome: {
        value: function (value) {
            return new String(value)
        }
    },

    defaultPackageHome: {
        value: function () {
            var packageHome = process.cwd(),
                root = qfs.root();
            if (root === "") {
                root = "/"
            }
            while (true) {
                if (FS.existsSync(Path.join(packageHome, "package.json"))) {
                    break;
                }
                packageHome = Path.resolve(Path.join(packageHome, ".."));
                if (packageHome === root) {
                    packageHome = process.cwd();
                    break;
                }
            }
            return packageHome
        }
    },

    directory: {
        value: null,
        writable: true
    },

    buildDir: {
        value: null,
        writable: true
    },

    // The output destination relative to the package root
    destination: {
        value: null
    },

    process: {
        value: function(options) {
            this.options = options;
            if (typeof this.didSetOptions === "function") {
                this.didSetOptions(options);
            }
            var mainBuildDir = Path.join(os.tmpDir(), "build");
            this.buildDir = Path.join(mainBuildDir, this.options.templateName);
            var self = this;
            return qfs.exists(mainBuildDir).then(function(exists) {
                var promise;
                if (exists) {
                    promise = qfs.removeTree(mainBuildDir)
                        .then(function() {
                            return qfs.makeDirectory(mainBuildDir)
                        });
                } else {
                    promise = qfs.makeDirectory(mainBuildDir);
                }
                return promise.then(function() {
                    return qfs.copyTree(self.directory, self.buildDir)
                })
                .then(function() {
                    return self.processBuildDirectory(self.buildDir);
                });
            });
        }
    },

    finalDestination: {
        get: function() {
            return Path.join(this.options.packageHome || "", this.options.destination || "")
        }
    },


    finish: {
        value: function() {
            var self = this;
            //TODO need to gracefully handle when the destination exists already right now we just fail.
            return qfs.makeTree(this.finalDestination).then(function() {
                return qfs.list(self.buildDir, function(path, stat) {
                    return stat.isFile() || stat.isDirectory();
                }).then(function(filenames) {
                    return Q.all(filenames.map(function(name) {
                        var destination = Path.join(self.finalDestination, name);
                        return qfs.exists(destination)
                            .then(function(destinationExists) {
                                if(!destinationExists) {
                                    return qfs.move(Path.join(self.buildDir, name), destination);
                                } else {
                                    throw new MinitError("Cannot overwrite " + destination);
                                }
                            });
                    }));
                })
            });
         }
    },

    _finish: {
        value: function() {
            var self = this;
            return this.finish(this.finalDestination).then(function() {
                return qfs.removeDirectory(self.buildDir)
            });
        }
    },

    processDirectory: {
        value: function processDirectory(dirname) {
            var self = this;
            return this.rename(dirname).then(function(dirname) {
                return qfs.list(dirname, function(path, stat) {
                    return stat.isFile() || stat.isDirectory();
                }).then(function(filenames) {
                    return Q.all(filenames.map(function(name) {
                        var path = Path.join(dirname, name);
                        return qfs.stat(path).then(function(stat) {
                            var promise;
                            if (stat.isFile() && /\.(html|json|js|css|markdown|md)$/.test(name)) {
                                promise = self.processFile(path);
                            } else if (stat.isDirectory()){
                                promise = self.processDirectory(path);
                            }
                            return promise;
                        });
                    }));
                });
            });
        }
    },

    processBuildDirectory: {
        value: function processDirectory(dirname) {
            var self = this;
            return this.processDirectory(dirname).then(function() {
                return self._finish();
            });
        }
    },

    processFile: {
        value: function processFile(filename) {
            var self = this;
            return qfs.read(filename).then(function(data) {
                data = data.toString();

                var newContents = self.applyTransform(data, self.options);

                return qfs.write(filename, newContents).then(function () {
                    return self.rename(filename)
                }).fail(function () {
                    console.log("Error writing to " + filename + ".");
                    throw "Error writing to " + filename + ".";
                });
            });
        }
    },

    applyTransform: {
        value: function(content, vars) {
            return Mustache.render(content, vars);
        }
    },

    rename: {
        value: function(filename) {
            var newName = filename;
            for (var name in this.options) {
                newName = newName.replace(
                    FILENAME_VARIABLE_START + name + FILENAME_VARIABLE_END,
                    this.options[name]
                );
            }
            if(newName === filename) {
                return Q.resolve(filename);
            } else {
                var done = Q.defer();
                qfs.move(filename, newName).then(function () {
                    done.resolve(newName);
                }).done();
                return done.promise;
            }
        }
    }

});
