var jasmine = require("jasmine-node");

var SandboxedModule = require('sandboxed-module');

describe("minit", function () {

    describe("create", function () {

        it("should call command method ", function () {

            var mockModule = {};
            mockModule.command = function () {
                var command = {};
                command.parse = function () {};
                return command;
            };
            var commandSpy = spyOn(mockModule, "command").andCallThrough();

            var main = SandboxedModule.require('../main', {
              requires: {'./lib/create': mockModule}
            });

            main.command.parse([null,null, "create"]);

            expect(commandSpy).toHaveBeenCalled();
        });

    });

    xdescribe("serve", function () {

        it("should call command method ", function () {

            var mockModule = {};
            mockModule.command = function () {
                var command = {};
                command.parse = function () {};
                return command;
            };
            var commandSpy = spyOn(mockModule, "command").andCallThrough();

            var main = SandboxedModule.require('../main', {
              requires: {'./lib/serve': mockModule}
            });

            main.command.parse([null,null, "serve"]);

            expect(commandSpy).toHaveBeenCalled();
        });

    });

});