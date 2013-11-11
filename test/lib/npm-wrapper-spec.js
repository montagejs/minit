var SandboxedModule = require('sandboxed-module');

function nextTickCallback() {
    process.nextTick(arguments[arguments.length - 1]);
}

describe("NpmWrapper", function () {
    var NpmWrapper, npmMock;
    beforeEach(function () {
        npmMock = {
            load: nextTickCallback,
            commands: {
                install: nextTickCallback
            }
        };
        NpmWrapper = SandboxedModule.require('../../lib/npm-wrapper', {
            requires: {
                "npm": npmMock
            }
        });
    });

    it("loads", function () {
        npmMock.load = jasmine.createSpy().andCallFake(nextTickCallback);
        var config = {};
        var npm = new NpmWrapper(config);
        return npm.loaded.then(function (value) {
            expect(npmMock.load).toHaveBeenCalled();
            expect(npmMock.load.mostRecentCall.args[0]).toBe(config);
            expect(value).toBe(npm);
        });
    });

    it("loads without a config", function () {
        npmMock.load = jasmine.createSpy().andCallFake(nextTickCallback);
        var npm = new NpmWrapper();
        return npm.loaded.then(function (value) {
            expect(npmMock.load).toHaveBeenCalled();
            expect(value).toBe(npm);
        });
    });

    it("calls install", function () {
        npmMock.commands.install = jasmine.createSpy().andCallFake(nextTickCallback);
        var npm = new NpmWrapper();
        return npm.install().then(function () {
            expect(npmMock.commands.install).toHaveBeenCalled();
        });
    });

    it("does not allow two open instances", function () {
        var a = new NpmWrapper();
        var b;
        expect(function () {
            b = new NpmWrapper();
        }).toThrow();
        expect(a).toBeDefined();
        expect(b).not.toBeDefined();
    });

    it("allows a second instance after closing the first", function () {
        var a = new NpmWrapper();
        a.close();
        var b = new NpmWrapper();
        expect(b).toBeDefined();
    });

    it("returns a rejected promise after being closed", function () {
        var a = new NpmWrapper();
        a.close();
        return a.install().then(function () {
            expect(true).toBe(false);
        }, function (error) {
            expect(error.message).toEqual("This npm wrapper is closed");
        });
    });

});
