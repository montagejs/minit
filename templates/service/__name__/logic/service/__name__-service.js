var HttpService = require("montage/data/service/http-service").HttpService,
    DataService = require("montage/data/service/data-service").DataService,
    DataSelector = require("montage/data/service/data-selector").DataSelector,
    {{exportedName}} = require("../model/{{name}}-model").{{exportedName}};

/**
 * Provides data for applications.
 *
 * @class
 * @extends external:HttpService
 */
 var {{exportedName}}Service = exports.{{exportedName}}Service = HttpService.specialize(/** @lends {{exportedName}}Service.prototype */ {

    defaultName: {
        value: 'World'
    },
   
    fetchRawData: {
        value: function (stream) {
            var self = this,
                criteria = stream.query.criteria,
                name = criteria.parameters.name || this.defaultName;

            var data = {
                message: `Hello ${name}`
            };
            
            self.addRawData(stream, [data], criteria);
            self.rawDataDone(stream);
        }
    },

    mapFromRawData: {
        value: function (object, rawData, criteria) {
            object.message = rawData.message;
        }
    }
});