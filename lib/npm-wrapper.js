var Q = require("q");
var npm = require("npm");

// Because npm is a singleton there can actually only be one npm class active
// at one moment. It's checked and set to true in the NpmWrapper constructor
// and set to false in NpmWrapper#close.
var isInUse = false;

module.exports = NpmWrapper;
function NpmWrapper(config) {
    if (isInUse) {
        throw new Error("Someone else is using npm. Call #close() to release it.");
    }
    isInUse = true;
    this.closed = false;

    config = config || {};

    var self = this;
    this.loaded = Q.ninvoke(npm, "load", config)
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

        return self;
    });

}

NpmWrapper.prototype.install = function() {
    return this.loaded.then(function (self) {
        if (self.closed) {
            return self.closed;
        }
        return Q.ninvoke(npm.commands, "install");
    });
};

NpmWrapper.prototype.close = function() {
    isInUse = false;
    this.closed = Q.reject(new Error("This npm wrapper is closed"));
};
