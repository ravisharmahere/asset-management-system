import { Asset } from '../models/asset.entity';
import { Room } from '../models/room.entity';
import { Floor } from '../models/floor.entity';
import { Building } from '../models/building.entity';
import { Category } from '../models/category.entity';
import { Vendor } from '../models/vendor.entity';
import { AssetFile } from '../models/asset-file.entity';
import { AssetImage } from '../models/asset-image.entity';
import { logger } from '../utils/logger';
import { MySQLDatabase } from './../database';

async function deleteAssetFiles() {
  const assetFileRepository = MySQLDatabase.getInstance().getDataSource().getRepository(AssetFile);
  await assetFileRepository.clear();
  logger.info('All asset files deleted');
}

async function deleteAssetImages() {
  const assetImageRepository = MySQLDatabase.getInstance().getDataSource().getRepository(AssetImage);
  await assetImageRepository.clear();
  logger.info('All asset images deleted');
}

async function deleteAssets() {
  const assetRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Asset);
  await assetRepository.clear();
  logger.info('All assets deleted');
}

async function deleteRooms() {
  const roomRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Room);
  await roomRepository.clear();
  logger.info('All rooms deleted');
}

async function deleteFloors() {
  const floorRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Floor);
  await floorRepository.clear();
  logger.info('All floors deleted');
}

async function deleteBuildings() {
  const buildingRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Building);
  await buildingRepository.clear();
  logger.info('All buildings deleted');
}

async function deleteCategories() {
  const categoryRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Category);
  await categoryRepository.clear();
  logger.info('All categories deleted');
}

async function deleteVendors() {
  const vendorRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Vendor);
  await vendorRepository.clear();
  logger.info('All vendors deleted');
}

async function runUnseed() {
  try {
    logger.info('Starting database cleanup...');

    // Initialize connection
    const dataSource = MySQLDatabase.getInstance().getDataSource();
    await dataSource.initialize();
    logger.info('Database connection established');

    // Disable foreign key checks
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    logger.info('Foreign key checks disabled');

    // Delete data in the correct order to respect foreign key constraints
    await deleteAssetFiles();
    await deleteAssetImages();
    await deleteAssets();
    await deleteRooms();
    await deleteFloors();
    await deleteBuildings();
    await deleteCategories();
    await deleteVendors();

    // Re-enable foreign key checks
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    logger.info('Foreign key checks re-enabled');

    logger.info('Database cleanup completed successfully');

    // Close connection
    await dataSource.destroy();
  } catch (error) {
    logger.error('Error during database cleanup:', error);
    console.error(error);
    process.exit(1);
  }
}

// Run the unseeding
runUnseed();
