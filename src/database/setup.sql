-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `asset_management` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON `asset_management`.* TO 'admin'@'%';
FLUSH PRIVILEGES;

-- Use the database
USE `asset_management`; 