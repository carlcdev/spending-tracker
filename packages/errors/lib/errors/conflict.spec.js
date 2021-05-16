"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var conflict_1 = require("./conflict");
describe('conflict', function () {
    it('should extend the Error type with a name of Conflict', function () {
        var error = new conflict_1.Conflict('test message');
        expect(error.message).toEqual('test message');
        expect(error.name).toEqual('Conflict');
    });
});
