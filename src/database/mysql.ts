// mysql.ts
import { DataSource } from 'typeorm';
import { logger } from '../utils/logger';
import { DB_CONFIG } from '../config';

export class MySQLDatabase {
  private static instance: MySQLDatabase;
  private dataSource: DataSource;

  private constructor() {
    this.dataSource = new DataSource({
      type: 'mysql',
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      username: DB_CONFIG.username,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      synchronize: true,
      logging: false,
      entities: [__dirname + '/../models/*.entity{.js,.ts}'],
      migrations: [__dirname + '/migrations/*{.js,.ts}'],
      extra: {
        charset: 'utf8mb4_unicode_ci',
        connectionLimit: 10,
        multipleStatements: true,
      },
    });
  }

  public static getInstance(): MySQLDatabase {
    if (!MySQLDatabase.instance) {
      MySQLDatabase.instance = new MySQLDatabase();
    }
    return MySQLDatabase.instance;
  }

  public async connect(): Promise<void> {
    try {
      // First connect without database to create it
      const dataSource = new DataSource({
        type: 'mysql',
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        username: DB_CONFIG.username,
        password: DB_CONFIG.password,
        database: DB_CONFIG.database,
        synchronize: true,
        logging: false,
        entities: [__dirname + '/../models/*.entity{.js,.ts}'],
        migrations: [__dirname + '/migrations/*{.js,.ts}'],
        extra: {
          charset: 'utf8mb4_unicode_ci',
          connectionLimit: 10,
          multipleStatements: true,
        },
      });

      await dataSource.initialize();
      logger.info('Initial connection established');

      // Create database if it doesn't exist
      await dataSource.query(`
        CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` 
        CHARACTER SET utf8mb4 
        COLLATE utf8mb4_unicode_ci;
      `);
      logger.info(`Database ${DB_CONFIG.database} created or already exists`);

      // Close the temporary connection
      await dataSource.destroy();

      // Now connect to the actual database
      await this.dataSource.initialize();
      logger.info('MySQL database connection established successfully');
    } catch (error) {
      logger.error('Error connecting to MySQL database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.dataSource && this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        logger.info('MySQL database connection closed');
      }
    } catch (error) {
      logger.error('Error disconnecting from MySQL database:', error);
      throw error;
    }
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }
}
