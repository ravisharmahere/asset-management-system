// src/config.ts
require('dotenv').config();
import config from 'config';
import path from 'path';

// Node environment
export const nodeEnv = config.get<string>('nodeEnv');
export const port = config.get<number>('port');
export const apiVersion = config.get<string>('apiVersion');
export const logLevel = config.get<string>('logLevel');

// Database configuration
export const DB_CONFIG = {
  host: config.get<string>('dbHost'),
  port: config.get<number>('dbPort'),
  username: config.get<string>('dbUsername'),
  password: config.get<string>('dbPassword'),
  database: config.get<string>('dbName'),
};

// File upload configuration
export const UPLOAD_CONFIG = {
  directory: config.get<string>('upload.directory'),
  imageDirectory: config.get<string>('upload.imageDirectory'),
  documentDirectory: config.get<string>('upload.documentDirectory'),
  maxFileSize: config.get<number>('upload.maxFileSize'), // Maximum file size in bytes
  allowedMimeTypes: config.get<string[]>('upload.allowedMimeTypes'), // Array of allowed MIME types
  maxFiles: config.get<number>('upload.maxFiles'), // Maximum number of files allowed
};

// Create upload directories if they don't exist
import fs from 'fs';
if (!fs.existsSync(UPLOAD_CONFIG.directory)) {
  fs.mkdirSync(UPLOAD_CONFIG.directory, { recursive: true });
}
if (!fs.existsSync(UPLOAD_CONFIG.imageDirectory)) {
  fs.mkdirSync(UPLOAD_CONFIG.imageDirectory, { recursive: true });
}
if (!fs.existsSync(UPLOAD_CONFIG.documentDirectory)) {
  fs.mkdirSync(UPLOAD_CONFIG.documentDirectory, { recursive: true });
}
