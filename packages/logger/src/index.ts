import * as winston from 'winston';

let loggerInitialised = false;

const namespaceFormat = (namespace: string) =>
  winston.format((info) => {
    info.namespace = namespace;

    return info;
  });

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
  ],
});

export function initLogger(namespace: string): void {
  if (!loggerInitialised && process.env.NODE_ENV !== 'test') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          namespaceFormat(namespace)(),
          winston.format.simple()
        ),
      })
    );

    loggerInitialised = true;
  }
}
