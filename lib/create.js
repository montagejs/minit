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
var MinitError = require("./error").MinitError;

var create = exports = module.exports = function(templateName, config, templateModule) {

    config.templateName = templateName;

    if(!templateModule) {
        templateModule = require("../templates/" + config.templateName);
    }
    var Template = templateModule.Template;
    if (!config.destination) {
        config.destination = Template.destination;
    }

    if (! config.parent) {
        config.minitHome = path.join(__dirname, "..");
        config.templatesDir = path.join(config.minitHome, "templates");
    } else {
        config.minitHome = config.parent.minitHome;
        //config.templatesDir = config.parent.templatesDir;
        config.templatesDir = path.join(config.minitHome, "templates");
    }


    var aTemplate = Template.newWithDirectory(path.join(config.templatesDir,templateName));

    return aTemplate.process(config).then(function () {
        // Build resultPath now that it's known
        config.resultPath = path.join(
            config.packageHome || "",
            config.destination || "",
            config.name + "." + config.extensionName
        );
        return config;
    });

};
exports.create = create;

exports.addCommandsTo = function(program) {
    var templatesDir = path.join(program.minitHome, "templates");
    var fileNames = fs.readdirSync(templatesDir);
    fileNames.forEach(function(filename) {
        var stats = fs.statSync(path.join(templatesDir,filename));
        if (stats.isDirectory()) {
            var templateModule = require("../templates/" + filename);
            var command = program.command("create:" + filename)
            .description(templateModule.Template.commandDescription)
            .action(function(env){
                exports.create(filename, command, templateModule)
                    .fail(function(error) {
                        var message = error.message;
                        if (error instanceof MinitError) {
                            console.error(error.message);
                        } else {
                            throw error;
                        }
                    }).done();
            });
            templateModule.Template.addOptions(command);
        }
    });
    return program;
};


