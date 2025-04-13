// import { DataSource } from 'typeorm';
// import { logger } from '../utils/logger';
// import { DB_CONFIG } from '../config';

// async function testConnection() {
//   try {
//     // First try to connect without specifying a database
//     const tempDataSource = new DataSource({
//       type: 'mysql',
//       host: DB_CONFIG.host,
//       port: DB_CONFIG.port,
//       username: DB_CONFIG.username,
//       password: DB_CONFIG.password,
//       synchronize: false,
//       logging: true,
//     });

//     logger.info('Attempting to connect to database server...');
//     await tempDataSource.initialize();
//     logger.info('Successfully connected to database server');

//     try {
//       logger.info('Attempting to create database...');
//       await tempDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
//       logger.info(`Database ${DB_CONFIG.database} created successfully`);
//     } catch (error) {
//       logger.error('Error creating database:', error);
//       throw error;
//     }

//     await tempDataSource.destroy();
//     logger.info('Connection closed');
//   } catch (error) {
//     logger.error('Connection test failed:', error);
//     throw error;
//   }
// }

// // Run the test
// testConnection().catch(error => {
//   console.error('Test failed:', error);
//   process.exit(1);
// });
