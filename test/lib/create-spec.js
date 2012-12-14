var jasmine = require("jasmine-node");

var SandboxedModule = require('sandboxed-module');

describe("create", function () {

    describe("app", function () {

        it("should call create method ", function () {

            var fileStructure = {
                '__minitHome': {
                    'templates': {
                        'app': {

                        },
                        'app.js': 1
                    }
                },
                '__packageHome': {
                    'package.json': 1
                }
            };

            var create = SandboxedModule.require('../../lib/create', {
              requires: {
                  'fs': require("mocks").fs.create(fileStructure)
              }
            });

            var main = SandboxedModule.require('../../main', {
              requires: {
                  'fs': require("mocks").fs.create(fileStructure),
                  './lib/create': create
              }
            });

            var createSpy = spyOn(create, "create");

            main.command.minitHome = '/__minitHome';
            main.command.packageHome = '/__packageHome';
            main.command.templatesDir = '/__minitHome/templates';


            create.command(main.command).parse([null,null, "create", "app"]);

            expect(createSpy).toHaveBeenCalled();
        });

    });

});