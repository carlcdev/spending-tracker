"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_gateway_error_transformer_1 = require("./api-gateway-error-transformer");
var errors_1 = require("../errors");
describe('api-gateway-error-transformer', function () {
    describe('when an unhandled error is passed', function () {
        it('should return a 500 hiding the internal error', function () {
            var result = api_gateway_error_transformer_1.apiGatewayErrorTransformer(new Error('An unhandled error message'));
            expect(result).toEqual({
                statusCode: 500,
                body: '"An error occurred"',
            });
        });
    });
    describe('when an AppError error is passed', function () {
        it('should return a 500 hiding the internal error', function () {
            var result = api_gateway_error_transformer_1.apiGatewayErrorTransformer(new errors_1.AppError("An internal error we wouldn't want to expose to a consumer"));
            expect(result).toEqual({
                statusCode: 500,
                body: '"An error occurred"',
            });
        });
    });
    describe('when a NotFound error is passed', function () {
        it('should return a 404 with the error message', function () {
            var result = api_gateway_error_transformer_1.apiGatewayErrorTransformer(new errors_1.NotFound('The resource was not found'));
            expect(result).toEqual({
                statusCode: 404,
                body: '"The resource was not found"',
            });
        });
    });
    describe('when a Conflict error is passed', function () {
        it('should return a 409 with the error message', function () {
            var result = api_gateway_error_transformer_1.apiGatewayErrorTransformer(new errors_1.Conflict('The resource already exists'));
            expect(result).toEqual({
                statusCode: 409,
                body: '"The resource already exists"',
            });
        });
    });
    describe('when a BadRequest error is passed', function () {
        it('should return a 400 with the error message', function () {
            var result = api_gateway_error_transformer_1.apiGatewayErrorTransformer(new errors_1.BadRequest('There was an error with the request'));
            expect(result).toEqual({
                statusCode: 400,
                body: '"There was an error with the request"',
            });
        });
    });
});
