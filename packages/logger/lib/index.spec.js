"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
describe('logger', function () {
    it('should have an info method', function () {
        expect(_1.logger.info).toBeInstanceOf(Function);
    });
    it('should have an warn method', function () {
        expect(_1.logger.warn).toBeInstanceOf(Function);
    });
    it('should have an error method', function () {
        expect(_1.logger.error).toBeInstanceOf(Function);
    });
});
