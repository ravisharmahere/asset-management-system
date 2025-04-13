import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils';

/**
 * Logging Middleware
 * Logs incoming HTTP requests and outgoing responses.
 */
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { method, originalUrl } = req;
  const start = process.hrtime();

  // Log the incoming request
  logger.info(`Incoming Request: ${method} ${originalUrl}`);

  res.on('finish', () => {
    const { statusCode } = res;
    const duration = process.hrtime(start);
    const durationInMs = (duration[0] * 1000 + duration[1] / 1e6).toFixed(3);

    // Log the outgoing response
    logger.info(`Outgoing Response: ${method} ${originalUrl} ${statusCode} ${durationInMs}ms`);
  });

  next();
};
