import { Router } from 'express';
import { logger } from '../utils';
import { apiVersion } from '../config';
import { RegisterApiRoutes, RegisterErrorHandler, RegisterMiddleware } from '.';

/**
 * Init Express REST routes
 *
 * @param {Router} router
 * @returns {void}
 */

export const initRoutes = (router: Router): void => {
  const prefix = `/api/${apiVersion}`;
  logger.info(`Initializing API routes on ${prefix}`);
  RegisterMiddleware(router);
  RegisterApiRoutes(router, prefix);
  RegisterErrorHandler(router);
};
