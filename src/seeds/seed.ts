// src/database/seeds/seed.ts
import { Building } from '../models/building.entity';
import { Floor } from '../models/floor.entity';
import { Room } from '../models/room.entity';
import { Category } from '../models/category.entity';
import { Vendor } from '../models/vendor.entity';
import { Asset } from '../models/asset.entity';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { MySQLDatabase } from './../database';
import { AssetCondition, AssetStatus } from '../models/asset.entity';
import { AssetOwnership } from '../models/asset.entity';

async function seedCategories() {
  const categoryRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Category);

  // Default categories with descriptions
  const defaultCategories = [
    { name: 'Furniture', description: 'Office furniture and fixtures' },
    { name: 'Computer Equipment', description: 'Desktop computers, laptops, and accessories' },
    { name: 'Electronics', description: 'Electronic devices and gadgets' },
    { name: 'Office Supplies', description: 'General office supplies and consumables' },
    { name: 'Networking Equipment', description: 'Network devices and infrastructure' },
    { name: 'Fixtures', description: 'Building fixtures and fittings' },
    { name: 'Machinery', description: 'Industrial machinery and equipment' },
    { name: 'Vehicles', description: 'Company vehicles and transportation' },
    { name: 'Tools', description: 'Tools and equipment' },
    { name: 'Books', description: 'Books and publications' },
    { name: 'Software Licenses', description: 'Software licenses and subscriptions' },
    { name: 'Audio/Video Equipment', description: 'Audio and video equipment' },
    { name: 'Security Equipment', description: 'Security and surveillance equipment' },
    { name: 'Medical Equipment', description: 'Medical and healthcare equipment' },
    { name: 'Lab Equipment', description: 'Laboratory equipment and supplies' },
  ];

  for (const category of defaultCategories) {
    // Check if category exists
    const existingCategory = await categoryRepository.findOne({
      where: { name: category.name },
    });

    if (!existingCategory) {
      const newCategory = categoryRepository.create({
        id: uuidv4(),
        name: category.name,
        description: category.description,
      });

      await categoryRepository.save(newCategory);
    }
  }

  logger.info('Default categories seeded');
}

async function seedVendors() {
  const vendorRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Vendor);

  // Default vendors with contact information
  const defaultVendors = [
    {
      name: 'Office Depot',
      contactPerson: 'John Smith',
      email: 'john.smith@officedepot.com',
      phone: '+1-555-0123',
      address: '123 Office Street, Business City, 12345',
    },
    {
      name: 'Dell',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.johnson@dell.com',
      phone: '+1-555-0124',
      address: '456 Tech Avenue, Silicon Valley, 54321',
    },
    {
      name: 'HP',
      contactPerson: 'Michael Brown',
      email: 'michael.brown@hp.com',
      phone: '+1-555-0125',
      address: '789 Innovation Drive, Tech City, 67890',
    },
    {
      name: 'Apple',
      contactPerson: 'Lisa Chen',
      email: 'lisa.chen@apple.com',
      phone: '+1-555-0126',
      address: '321 Infinite Loop, Cupertino, 95014',
    },
    {
      name: 'Lenovo',
      contactPerson: 'David Wilson',
      email: 'david.wilson@lenovo.com',
      phone: '+1-555-0127',
      address: '654 Computer Road, Tech Park, 13579',
    },
    {
      name: 'Cisco',
      contactPerson: 'Emily Davis',
      email: 'emily.davis@cisco.com',
      phone: '+1-555-0128',
      address: '987 Network Lane, San Jose, 95134',
    },
    {
      name: 'Microsoft',
      contactPerson: 'Robert Taylor',
      email: 'robert.taylor@microsoft.com',
      phone: '+1-555-0129',
      address: '147 Software Way, Redmond, 98052',
    },
    {
      name: 'Samsung',
      contactPerson: 'Jennifer Lee',
      email: 'jennifer.lee@samsung.com',
      phone: '+1-555-0130',
      address: '258 Electronics Blvd, Seoul, 06765',
    },
    {
      name: 'IKEA',
      contactPerson: 'Anders Svensson',
      email: 'anders.svensson@ikea.com',
      phone: '+1-555-0131',
      address: '369 Furniture Street, Älmhult, 343 21',
    },
    {
      name: 'Amazon',
      contactPerson: 'Jeff Bezos',
      email: 'jeff.bezos@amazon.com',
      phone: '+1-555-0132',
      address: '741 E-commerce Drive, Seattle, 98109',
    },
  ];

  for (const vendor of defaultVendors) {
    // Check if vendor exists
    const existingVendor = await vendorRepository.findOne({
      where: { name: vendor.name },
    });

    if (!existingVendor) {
      const newVendor = vendorRepository.create({
        id: uuidv4(),
        ...vendor,
      });

      await vendorRepository.save(newVendor);
    }
  }

  logger.info('Default vendors seeded');
}

async function seedLocations() {
  const buildingRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Building);
  const floorRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Floor);
  const roomRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Room);

  // Create buildings
  const buildings = [
    { name: 'Main Building', address: '123 Main Street, City Center, 10001' },
    { name: 'Tech Center', address: '456 Innovation Drive, Tech Park, 20002' },
    { name: 'Research Facility', address: '789 Science Avenue, Research Park, 30003' },
  ];

  for (const buildingData of buildings) {
    let building = await buildingRepository.findOne({
      where: { name: buildingData.name },
    });

    if (!building) {
      building = buildingRepository.create({
        id: uuidv4(),
        name: buildingData.name,
        address: buildingData.address,
      });

      await buildingRepository.save(building);
      logger.info(`${buildingData.name} created`);

      // Create floors for each building
      const floorNames = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];

      for (const floorName of floorNames) {
        const floor = floorRepository.create({
          id: uuidv4(),
          name: floorName,
          building_id: building.id,
        });

        await floorRepository.save(floor);

        // Create rooms for each floor
        const roomCount = Math.floor(Math.random() * 5) + 3; // 3-7 rooms per floor

        for (let i = 1; i <= roomCount; i++) {
          const roomTypes = ['Office', 'Conference Room', 'Storage', 'Lab', 'Workshop'];
          const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];

          const room = roomRepository.create({
            id: uuidv4(),
            name: `${roomType} ${i}`,
            floor_id: floor.id,
            capacity: Math.floor(Math.random() * 20) + 5, // 5-25 capacity
          });

          await roomRepository.save(room);
        }
      }
    } else {
      logger.info(`${buildingData.name} already exists, skipping location seeding`);
    }
  }
}

async function seedAssets() {
  const assetRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Asset);
  const categoryRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Category);
  const vendorRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Vendor);
  const roomRepository = MySQLDatabase.getInstance().getDataSource().getRepository(Room);

  // Get all categories, vendors, and rooms for reference
  const categories = await categoryRepository.find();
  const vendors = await vendorRepository.find();
  const rooms = await roomRepository.find();

  if (categories.length === 0 || vendors.length === 0 || rooms.length === 0) {
    logger.warn('Cannot seed assets: missing categories, vendors, or rooms');
    return;
  }

  // Sample assets to create
  const sampleAssets = [
    {
      name: 'Dell Latitude Laptop',
      description: 'Dell Latitude 5520 Business Laptop',
      categoryId: categories.find(c => c.name === 'Computer Equipment')?.id,
      vendorId: vendors.find(v => v.name === 'Dell')?.id,
      locationId: rooms[Math.floor(Math.random() * rooms.length)].id,
      status: AssetStatus.IN_USE,
      condition: AssetCondition.GOOD,
      purchaseDate: new Date('2023-01-15'),
      purchasePrice: 1299.99,
      code: 'DL5520-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      warrantyExpiryDate: new Date('2025-01-15'),
    },
    {
      name: 'HP LaserJet Printer',
      description: 'HP LaserJet Pro M404dn Network Printer',
      categoryId: categories.find(c => c.name === 'Computer Equipment')?.id,
      vendorId: vendors.find(v => v.name === 'HP')?.id,
      locationId: rooms[Math.floor(Math.random() * rooms.length)].id,
      status: AssetStatus.IN_USE,
      condition: AssetCondition.GOOD,
      purchaseDate: new Date('2023-02-20'),
      purchasePrice: 299.99,
      code: 'HL404-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      warrantyExpiryDate: new Date('2025-02-20'),
    },
    {
      name: 'Conference Room Table',
      description: 'Large conference room table with 12 seats',
      categoryId: categories.find(c => c.name === 'Furniture')?.id,
      vendorId: vendors.find(v => v.name === 'IKEA')?.id,
      locationId:
        rooms.find(r => r.name.includes('Conference Room'))?.id || rooms[Math.floor(Math.random() * rooms.length)].id,
      status: AssetStatus.IN_USE,
      condition: AssetCondition.GOOD,
      purchaseDate: new Date('2023-03-10'),
      purchasePrice: 899.99,
      code: 'CRT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      warrantyExpiryDate: new Date('2026-03-10'),
    },
    {
      name: 'Cisco Switch',
      description: 'Cisco Catalyst 2960 Network Switch',
      categoryId: categories.find(c => c.name === 'Networking Equipment')?.id,
      vendorId: vendors.find(v => v.name === 'Cisco')?.id,
      locationId: rooms[Math.floor(Math.random() * rooms.length)].id,
      status: AssetStatus.IN_USE,
      condition: AssetCondition.GOOD,
      purchaseDate: new Date('2023-04-05'),
      purchasePrice: 499.99,
      code: 'CS2960-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      warrantyExpiryDate: new Date('2025-04-05'),
    },
    {
      name: 'Office Chair',
      description: 'Ergonomic office chair with lumbar support',
      categoryId: categories.find(c => c.name === 'Furniture')?.id,
      vendorId: vendors.find(v => v.name === 'Office Depot')?.id,
      locationId: rooms[Math.floor(Math.random() * rooms.length)].id,
      status: AssetStatus.IN_USE,
      condition: AssetCondition.GOOD,
      purchaseDate: new Date('2023-05-12'),
      purchasePrice: 199.99,
      code: 'OC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      warrantyExpiryDate: new Date('2025-05-12'),
    },
  ];

  for (const assetData of sampleAssets) {
    // Check if asset with same code exists
    const existingAsset = await assetRepository.findOne({
      where: { code: assetData.code },
    });

    if (!existingAsset) {
      // Make sure we have valid category and room IDs
      if (!assetData.categoryId || !assetData.locationId) {
        logger.warn(`Skipping asset ${assetData.name} due to missing category or room ID`);
        continue;
      }

      const asset = assetRepository.create({
        id: uuidv4(),
        name: assetData.name,
        code: assetData.code,
        description: assetData.description,
        category_id: assetData.categoryId,
        room_id: assetData.locationId,
        vendor_id: assetData.vendorId,
        status: assetData.status,
        condition: assetData.condition,
        purchase_date: assetData.purchaseDate,
        purchase_price: assetData.purchasePrice,
        ownership: AssetOwnership.SELF_OWNED, // Set default ownership
        created_by: 'system', // Set default creator
      });

      await assetRepository.save(asset);
    }
  }

  logger.info('Sample assets seeded');
}

async function runSeed() {
  try {
    logger.info('Starting database seeding...');

    // Initialize connection
    await MySQLDatabase.getInstance().getDataSource().initialize();
    logger.info('Database connection established');

    // Run seed functions
    await seedCategories();
    await seedVendors();
    await seedLocations();
    await seedAssets();

    logger.info('Database seeding completed successfully');

    // Close connection
    await MySQLDatabase.getInstance().getDataSource().destroy();
  } catch (error) {
    logger.error('Error during database seeding:', error);
    console.error(error);
    process.exit(1);
  }
}

// Run the seeding
runSeed();
