{{#copyright}}/* {{{copyright}}} */

{{/copyright}}/**
    @module "ui/welcome.reel"
    @requires montage/ui/component
*/
var Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/welcome.reel".Welcome
    @extends module:ui/component.Component
*/
exports.Welcome = Component.specialize(/** @lends module:"ui/welcome.reel".Welcome# */ {

    montageDescription: {
        get: function() {
            return montageRequire.packageDescription;
        }
    }

});
