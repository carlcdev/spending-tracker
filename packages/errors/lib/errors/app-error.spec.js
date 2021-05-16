"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_error_1 = require("./app-error");
describe('app-error', function () {
    it('should extend the Error type with a name of AppError', function () {
        var error = new app_error_1.AppError('test message');
        expect(error.message).toEqual('test message');
        expect(error.name).toEqual('AppError');
    });
});
