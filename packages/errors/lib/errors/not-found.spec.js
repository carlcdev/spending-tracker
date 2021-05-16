"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var not_found_1 = require("./not-found");
describe('not-found', function () {
    it('should extend the Error type with a name of NotFound', function () {
        var error = new not_found_1.NotFound('test message');
        expect(error.message).toEqual('test message');
        expect(error.name).toEqual('NotFound');
    });
});
