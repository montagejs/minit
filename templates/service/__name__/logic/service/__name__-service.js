var HttpService = require("montage/data/service/http-service").HttpService,
    DataService = require("montage/data/service/data-service").DataService,
    DataSelector = require("montage/data/service/data-selector").DataSelector,
    {{exportedName}} = require("../model/{{name}}-model").{{exportedName}};

/**
 * Provides area briefs data for applications.
 *
 * @class
 * @extends external:DataService
 */
 var {{exportedName}}Service = exports.{{exportedName}}Service = HttpService.specialize(/** @lends HelloWorldService.prototype */ {

    defaultName: {
        value: 'World'
    },
   
    fetchRawData: {
        value: function (stream) {
            var self = this,
                criteria = stream.query.criteria,
                name = criteria.name || this.defaultName;

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