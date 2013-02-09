{{#copyright}}/* {{{copyright}}} */

{{/copyright}}/**
    @module "{{jsdocModule}}{{destination}}/{{name}}"
    @requires montage
*/
var Montage = require("montage").Montage;

/**
    Description TODO
    @class module:"{{jsdocModule}}{{destination}}/{{name}}".{{exportedName}}
    @extends module:montage.Montage
*/
exports.{{exportedName}} = Montage.create(Montage, /** @lends module:"{{jsdocModule}}{{destination}}/{{name}}".{{exportedName}}# */ {

});
