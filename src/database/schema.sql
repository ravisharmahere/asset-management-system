-- Asset Management System Database Schema
-- This file contains the SQL statements to create tables for the Asset Management System

-- -----------------------------------------------------
-- Database asset_management
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `asset_management` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `asset_management`;

-- -----------------------------------------------------
-- Table `building`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `building` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `floor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `floor` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `building_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_floor_building_idx` (`building_id` ASC),
  CONSTRAINT `fk_floor_building`
    FOREIGN KEY (`building_id`)
    REFERENCES `building` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `room` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `floor_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_room_floor_idx` (`floor_id` ASC),
  CONSTRAINT `fk_room_floor`
    FOREIGN KEY (`floor_id`)
    REFERENCES `floor` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `category` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `vendor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vendor` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `asset`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `room_id` VARCHAR(36) NOT NULL,
  `status` ENUM('In Use', 'In Storage', 'Under Maintenance', 'Disposed', 'Lost') NOT NULL DEFAULT 'In Use',
  `condition` ENUM('Excellent', 'Good', 'Fair', 'Poor', 'Not Working') NOT NULL DEFAULT 'Good',
  `brand` VARCHAR(100) NULL,
  `model` VARCHAR(100) NULL,
  `linked_asset_id` VARCHAR(36) NULL,
  `description` TEXT NULL,
  `cwip_invoice_id` VARCHAR(100) NULL,
  
  -- Purchase information
  `vendor_id` VARCHAR(36) NULL,
  `po_number` VARCHAR(100) NULL,
  `invoice_date` DATE NULL,
  `invoice_number` VARCHAR(100) NULL,
  `purchase_date` DATE NULL,
  `purchase_price` DECIMAL(15,2) NULL,
  `ownership` ENUM('Owned', 'Leased', 'Rented') NOT NULL DEFAULT 'Owned',
  
  -- Financial information
  `capitalization_price` DECIMAL(15,2) NULL,
  `end_of_life` DATE NULL,
  `capitalization_date` DATE NULL,
  `depreciation_percentage` DECIMAL(5,2) NULL,
  `accumulated_depreciation` DECIMAL(15,2) NULL,
  `scrap_value` DECIMAL(15,2) NULL,
  `income_tax_depreciation_percentage` DECIMAL(5,2) NULL,
  
  -- Metadata
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(36) NOT NULL,
  `updated_by` VARCHAR(36) NOT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE INDEX `code_UNIQUE` (`code` ASC),
  INDEX `fk_asset_category_idx` (`category_id` ASC),
  INDEX `fk_asset_room_idx` (`room_id` ASC),
  INDEX `fk_asset_linked_asset_idx` (`linked_asset_id` ASC),
  INDEX `fk_asset_vendor_idx` (`vendor_id` ASC),
  INDEX `fk_asset_created_by_idx` (`created_by` ASC),
  INDEX `fk_asset_updated_by_idx` (`updated_by` ASC),
  CONSTRAINT `fk_asset_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `category` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_room`
    FOREIGN KEY (`room_id`)
    REFERENCES `room` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_linked_asset`
    FOREIGN KEY (`linked_asset_id`)
    REFERENCES `asset` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_vendor`
    FOREIGN KEY (`vendor_id`)
    REFERENCES `vendor` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_created_by`
    FOREIGN KEY (`created_by`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_updated_by`
    FOREIGN KEY (`updated_by`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `asset_image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_image` (
  `id` VARCHAR(36) NOT NULL,
  `asset_id` VARCHAR(36) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `thumbnail_url` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `size` INT NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_asset_image_asset_idx` (`asset_id` ASC),
  CONSTRAINT `fk_asset_image_asset`
    FOREIGN KEY (`asset_id`)
    REFERENCES `asset` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `asset_file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_file` (
  `id` VARCHAR(36) NOT NULL,
  `asset_id` VARCHAR(36) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `size` INT NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_asset_file_asset_idx` (`asset_id` ASC),
  CONSTRAINT `fk_asset_file_asset`
    FOREIGN KEY (`asset_id`)
    REFERENCES `asset` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `asset_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_history` (
  `id` VARCHAR(36) NOT NULL,
  `asset_id` VARCHAR(36) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `field_name` VARCHAR(100) NULL,
  `old_value` TEXT NULL,
  `new_value` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_asset_history_asset_idx` (`asset_id` ASC),
  CONSTRAINT `fk_asset_history_asset`
    FOREIGN KEY (`asset_id`)
    REFERENCES `asset` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;