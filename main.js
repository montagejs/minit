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

var fs = require("fs");
var path = require("path");

var Command = require("commander").Command;

var config = require("./package.json");
var create = require("./lib/create");

exports.create = create;

var main = new Command();

main.version(config.version)
    .option('-p, --package-home [path]', 'package home', String, findPackageHome())
    .option('-t, --templates-dir [path]', 'templates directory', String, path.join(__dirname, "templates"))
;

create.addCommandsTo(main);

main.command('serve')
    .description('serve current directory with minit server.')
    .action(function(env){
        var args = this.args.slice(0);
        args.unshift(null,null);
        console.log('serving "%s"', env);
    });
//main.command('test')
//    .description('run tests')
//    .action(function(env){
//        require("./run-test");
//    });
exports.command = main;

//extras
main.minitHome = __dirname + "/";


function findPackageHome() {
    var packageHome = process.cwd();
    while (true) {
        if (fs.existsSync(path.join(packageHome, "package.json"))) {
            break;
        }
        packageHome = path.resolve(path.join(packageHome, ".."));
        if (packageHome === "/") {
            packageHome = process.cwd();
            break;
        }
    }
    return packageHome
}
