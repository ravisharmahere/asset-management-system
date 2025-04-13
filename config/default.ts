export default {
  port: 3000,
  host: 'localhost',
  nodeEnv: 'development',
  apiVersion: 'v1',
  logLevel: 'debug',
  upload: {
    directory: './files',
    imageDirectory: './files/images',
    documentDirectory: './files/documents',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFiles: 10,
  },
};
