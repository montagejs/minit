{{#copyright}}/* {{{copyright}}} */

{{/copyright}}/**
    @module "{{jsdocModule}}{{destination}}/{{name}}.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"{{jsdocModule}}{{destination}}/{{name}}.reel".{{exportedName}}
    @extends module:montage/ui/component.Component
*/
exports.{{exportedName}} = Montage.create(Component, /** @lends module:"{{jsdocModule}}{{destination}}/{{name}}.reel".{{exportedName}}# */ {

});
