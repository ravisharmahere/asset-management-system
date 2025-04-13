// logger.ts
import { createLogger, transports, format } from 'winston';

const logDir = 'logs';
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  HTTP = 'http',
}

const logger = createLogger({
  level: LogLevel.DEBUG,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
    format.printf(({ timestamp, level, message, stack }) => {
      const baseMessage = `${timestamp} [${level}]: ${message}`;
      if (level === 'error') {
        let functionName = 'unknown';
        let line = 'unknown';

        if (stack && typeof stack === 'string') {
          const stackLines = stack.split('\n');
          if (stackLines.length > 1) {
            const errorOrigin = stackLines[1].match(/at (\S+) \((.+):(\d+):\d+\)/);
            if (errorOrigin) {
              functionName = errorOrigin[1];
              line = errorOrigin[3];
            }
          }
        }

        return `${baseMessage} [function]: ${functionName} [line]: ${line}`;
      }
      return baseMessage;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
    new transports.File({ filename: `${logDir}/combined.log` }),
  ],
});

export { logger };
