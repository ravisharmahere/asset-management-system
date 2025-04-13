// init.database.ts
import { MySQLDatabase } from './mysql';
import { logger } from '../utils/logger';

export class Database {
  private static instance: Database;
  private mySQLDatabase: MySQLDatabase;

  private constructor() {
    this.mySQLDatabase = MySQLDatabase.getInstance();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.mySQLDatabase.connect();
      logger.info('All database connections established successfully');
    } catch (error) {
      logger.error('Error establishing database connections:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.mySQLDatabase.disconnect();
      logger.info('All database connections closed');
    } catch (error) {
      logger.error('Error closing database connections:', error);
      throw error;
    }
  }

  public getMySQL(): MySQLDatabase {
    return this.mySQLDatabase;
  }
}
