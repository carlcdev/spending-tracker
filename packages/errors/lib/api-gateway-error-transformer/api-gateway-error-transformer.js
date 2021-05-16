"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiGatewayErrorTransformer = void 0;
function apiGatewayErrorTransformer(error) {
    switch (error.name) {
        case 'BadRequest':
            return {
                statusCode: 400,
                body: JSON.stringify(error.message),
            };
        case 'NotFound':
            return {
                statusCode: 404,
                body: JSON.stringify(error.message),
            };
        case 'Conflict':
            return {
                statusCode: 409,
                body: JSON.stringify(error.message),
            };
        case 'AppError':
        default:
            return {
                statusCode: 500,
                body: JSON.stringify('An error occurred'),
            };
    }
}
exports.apiGatewayErrorTransformer = apiGatewayErrorTransformer;
