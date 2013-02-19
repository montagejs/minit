{{#copyright}}/* {{{copyright}}} */

{{/copyright}}/**
    @module "ui/welcome.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/welcome.reel".Welcome
    @extends module:ui/component.Component
*/
exports.Welcome = Montage.create(Component, /** @lends module:"ui/welcome.reel".Welcome# */ {

    montageDescription: {
        get: function() {
            return montageRequire.packageDescription;
        }
    }

});
