import { createServer, Server as HttpServer } from 'http';
import { Server } from './server';
import { logger } from './utils';
import { nodeEnv, port } from './config';
import { Database } from './database';

function registerProcessEvents(server: HttpServer): void {
  process.on('unhandledRejection', (error: any) => {
    logger.error('Unhandled Rejection:', error);
  });

  process.on('uncaughtException', (error: any) => {
    logger.error('Uncaught Exception:', error);
    shutdown(server);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received. Gracefully shutting down...');
    shutdown(server);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Gracefully shutting down...');
    shutdown(server);
  });
}

async function shutdown(server: HttpServer) {
  try {
    server.close(() => {
      logger.info('HTTP server closed');
    });
    await Database.getInstance().disconnect();
  } catch (error: any) {
    logger.error('Error during shutdown:', error);
  } finally {
    process.exit(0);
  }
}

async function startServer() {
  try {
    logger.info('Initializing server...');
    await Database.getInstance().connect();

    const serverInstance = new Server();
    const server = createServer(serverInstance.app);

    registerProcessEvents(server);

    server.listen(port, () => {
      logger.info(`Server is listening on port ${port} in ${nodeEnv} mode`);
      logger.info('Welcome to Asset Management System');
    });

    server.on('error', (error: any) => {
      logger.error('Server error:', error);
    });

    return server;
  } catch (error: any) {
    logger.error('Initialization error:', error);
    process.exit(1);
  }
}

startServer();
