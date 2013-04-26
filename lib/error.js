function MinitError(message, fileName, lineNumber) {
    var err = new Error();
    this.stack = err.stack.replace(/\n[^\n]*/,'');
    this.message    = message    === undefined ? err.message    : message;
    this.fileName   = fileName   === undefined ? err.fileName   : fileName;
    this.lineNumber = lineNumber === undefined ? err.lineNumber : lineNumber;
}

MinitError.prototype = new Error();
MinitError.prototype.constructor = MinitError;
MinitError.prototype.name = 'MinitError';

exports.MinitError = MinitError;
