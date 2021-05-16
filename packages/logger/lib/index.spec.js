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
    describe('initLogger', function () {
        it('should not add the console transport if NODE_ENV is test', function () {
            process.env.NODE_ENV = 'test';
            var loggerAddSpy = jest.spyOn(_1.logger, 'add');
            _1.initLogger('test namespace');
            expect(loggerAddSpy).toBeCalledTimes(0);
        });
        it('should add the console transport if not already initialised', function () {
            process.env.NODE_ENV = 'production';
            var loggerAddSpy = jest.spyOn(_1.logger, 'add');
            _1.initLogger('test namespace');
            expect(loggerAddSpy).toBeCalledTimes(1);
        });
        it('should not add another transpot if the logger is already initialised', function () {
            process.env.NODE_ENV = 'production';
            var loggerAddSpy = jest.spyOn(_1.logger, 'add');
            _1.initLogger('test namespace');
            _1.initLogger('test namespace');
            _1.initLogger('test namespace');
            expect(loggerAddSpy).toBeCalledTimes(1);
        });
    });
});
