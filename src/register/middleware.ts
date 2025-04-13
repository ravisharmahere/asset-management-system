import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import * as useragent from 'express-useragent';
import { loggerMiddleware } from '../middlewares';

export const RegisterMiddleware = (router: Router): void => {
  // 1. Security Middleware
  router.use(helmet());

  // 2. CORS Middleware
  const allowedOrigins = ['*'];
  router.use(cors({ origin: allowedOrigins })); // Consider restricting origins in production

  // 3. Response Compression
  router.use(compression());

  // 4. Body Parsing Middleware
  router.use(express.json({ limit: '10kb' })); // Limit payload size for security
  router.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // 5. User-Agent Parsing
  router.use(useragent.express());

  // 6. Logging Middleware
  // router.use(loggerMiddleware);
};
