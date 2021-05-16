"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bad_request_1 = require("./bad-request");
describe('bad-request', function () {
    it('should extend the Error type with a name of BadRequest', function () {
        var error = new bad_request_1.BadRequest('test message');
        expect(error.message).toEqual('test message');
        expect(error.name).toEqual('BadRequest');
    });
});
