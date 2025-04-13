import express, { Application } from 'express';
import { initRoutes } from './register';

export class Server {
  private readonly _app: Application = express();

  constructor() {
    initRoutes(this._app);
  }

  get app(): Application {
    return this._app;
  }
}
