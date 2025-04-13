import { Router, Request, Response, NextFunction } from 'express';
import { nodeEnv } from '../config';
import { NotFoundResponse } from '../core';
import { AssetRoutes, LocationRoutes } from '../routes';

export const RegisterApiRoutes = (router: Router, prefix: string): void => {
  router.get('/', (req: Request, res: Response) => {
    res.send(`WELCOME TO ASSET MANAGEMENT SYSTEM ${nodeEnv.toUpperCase()} ❤`);
  });

  router.get(prefix, (req: Request, res: Response) => {
    res.send(`WELCOME TO ASSET MANAGEMENT SYSTEM ${nodeEnv.toUpperCase()} API ❤`);
  });

  router.use(`${prefix}/assets`, new AssetRoutes().router);
  router.use(`${prefix}/locations`, new LocationRoutes().router);

  router.use((req: Request, res: Response, next: NextFunction) => new NotFoundResponse().send(res));
};
