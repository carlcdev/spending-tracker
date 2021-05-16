"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogger = exports.logger = void 0;
var winston = require("winston");
var loggerInitialised = false;
var namespaceFormat = function (namespace) {
    return winston.format(function (info) {
        info.namespace = namespace;
        return info;
    });
};
exports.logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
        }),
    ],
});
function initLogger(namespace) {
    if (!loggerInitialised && process.env.NODE_ENV !== 'test') {
        exports.logger.add(new winston.transports.Console({
            format: winston.format.combine(namespaceFormat(namespace)(), winston.format.simple()),
        }));
        loggerInitialised = true;
    }
}
exports.initLogger = initLogger;
