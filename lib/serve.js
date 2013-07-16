var joey = require("joey");

exports.serve = function(config) {
    joey
        .time()
        .error(true)
        .parseQuery()
        .normalize()
        .trap(function (response) {
            response.headers["Cache-Control"] = "no-cache";
        })
        .handleHtmlFragmentResponses()
        .listDirectories()
        .directoryIndex()
        .fileTree(config.root, {followInsecureSymbolicLinks: !!config.insecureSymlinks})
        .listen(config.port)
        .then(function (server) {
            console.log("Serving directory at http://localhost:" + server.address().port);
        })
       .done();
};

exports.addOptions = function (command) {
    command.option('-p, --port <number>', "port number to bind to.", 8083);
    command.option('-r, --root <path>', "The document root of the webserver.", process.cwd());
    command.option('-i, --insecure-symlinks', "Follow symlinks outside of the webserver's root directory.");
    return command;
};
