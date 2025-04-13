// asset.repository.ts
import { BaseRepository } from './base.repository';
import { Asset, AssetStatus, AssetCondition, AssetOwnership } from '../models/asset.entity';
import { AssetFile } from '../models/asset-file.entity';
import { AssetImage } from '../models/asset-image.entity';
import { AssetHistory } from '../models/asset-history.entity';
import { Vendor } from '../models/vendor.entity';
import { Category } from '../models/category.entity';
import { IAsset, IAssetCreate, IAssetUpdate, IVendor, IVendorCreate, IVendorUpdate } from '../interfaces';
import { NotFoundError, ConflictError } from '../utils/error';
import { generateUUID, generateAssetCode } from '../utils/helpers';
import { FindOptionsWhere, Like, Between } from 'typeorm';
import { IPaginationQuery } from '../interfaces/common.interface';

export class AssetRepository extends BaseRepository<Asset> {
  constructor() {
    super(Asset);
  }

  async findAllAssets(options?: {
    status?: AssetStatus;
    condition?: AssetCondition;
    categoryId?: string;
    roomId?: string;
    search?: string;
    purchaseStartDate?: Date;
    purchaseEndDate?: Date;
    pagination?: IPaginationQuery;
  }) {
    const whereClause: FindOptionsWhere<Asset> = {};

    if (options?.status) {
      whereClause.status = options.status;
    }

    if (options?.condition) {
      whereClause.condition = options.condition;
    }

    if (options?.categoryId) {
      whereClause.category_id = options.categoryId;
    }

    if (options?.roomId) {
      whereClause.room_id = options.roomId;
    }

    // Add search by name, code, or description
    if (options?.search) {
      return this.findAll({
        where: [
          { ...whereClause, name: Like(`%${options.search}%`) },
          { ...whereClause, code: Like(`%${options.search}%`) },
          { ...whereClause, description: Like(`%${options.search}%`) },
        ],
        relations: ['category', 'room', 'room.floor', 'room.floor.building', 'vendor'],
        pagination: options.pagination,
      });
    }

    // Add date range for purchase date
    if (options?.purchaseStartDate && options?.purchaseEndDate) {
      whereClause.purchase_date = Between(options.purchaseStartDate, options.purchaseEndDate);
    } else if (options?.purchaseStartDate) {
      whereClause.purchase_date = Between(options.purchaseStartDate, new Date('9999-12-31'));
    } else if (options?.purchaseEndDate) {
      whereClause.purchase_date = Between(new Date('1900-01-01'), options.purchaseEndDate);
    }

    return this.findAll({
      where: whereClause,
      relations: ['category', 'room', 'room.floor', 'room.floor.building', 'vendor'],
      pagination: options?.pagination,
    });
  }

  async findAssetById(id: string) {
    return this.findById(id, {
      relations: ['category', 'room', 'room.floor', 'room.floor.building', 'vendor', 'images', 'files', 'linkedAsset'],
    });
  }

  async findAssetByCode(code: string): Promise<Asset | null> {
    return this.repository.findOne({
      where: { code } as FindOptionsWhere<Asset>,
      relations: ['category', 'room', 'vendor'],
    });
  }

  async createAsset(data: IAssetCreate): Promise<Asset> {
    // Generate code if not provided
    if (!data.code) {
      data.code = generateAssetCode();
    }

    // Check if code already exists
    const existingAsset = await this.findAssetByCode(data.code);
    if (existingAsset) {
      throw new ConflictError(`Asset with code ${data.code} already exists`);
    }

    // Add created_by and updated_by
    const assetData = {
      ...data,
    };

    return this.create(assetData);
  }

  async updateAsset(id: string, data: IAssetUpdate): Promise<Asset> {
    // Check if code is being changed and already exists
    if (data.code) {
      const existingAsset = await this.findAssetByCode(data.code);
      if (existingAsset && existingAsset.id !== id) {
        throw new ConflictError(`Asset with code ${data.code} already exists`);
      }
    }

    // Add updated_by
    const assetData = {
      ...data,
    };

    return this.update(id, assetData);
  }

  async addAssetImage(
    assetId: string,
    imageData: {
      url: string;
      thumbnail_url: string;
      filename: string;
      size: number;
      mime_type: string;
    }
  ): Promise<AssetImage> {
    // Check if asset exists
    await this.findById(assetId);

    const imageRepository = this.repository.manager.getRepository(AssetImage);

    const image = imageRepository.create({
      id: generateUUID(),
      asset_id: assetId,
      ...imageData,
    });

    return imageRepository.save(image);
  }

  async addAssetFile(
    assetId: string,
    fileData: {
      url: string;
      filename: string;
      size: number;
      mime_type: string;
      category: string;
    }
  ): Promise<AssetFile> {
    // Check if asset exists
    await this.findById(assetId);

    const fileRepository = this.repository.manager.getRepository(AssetFile);

    const file = fileRepository.create({
      id: generateUUID(),
      asset_id: assetId,
      ...fileData,
    });

    return fileRepository.save(file);
  }

  async addAssetHistory(
    assetId: string,
    historyData: {
      action: string;
      field_name?: string;
      old_value?: string;
      new_value?: string;
    }
  ): Promise<AssetHistory> {
    // No need to check if asset exists for creation history
    const historyRepository = this.repository.manager.getRepository(AssetHistory);

    const history = historyRepository.create({
      id: generateUUID(),
      asset_id: assetId,
      ...historyData,
    });

    return historyRepository.save(history);
  }

  async getAssetHistory(assetId: string) {
    await this.findById(assetId); // Verify asset exists

    const historyRepository = this.repository.manager.getRepository(AssetHistory);

    return historyRepository.find({
      where: { asset_id: assetId } as FindOptionsWhere<AssetHistory>,
      order: { created_at: 'DESC' },
    });
  }
}

export class VendorRepository extends BaseRepository<Vendor> {
  constructor() {
    super(Vendor);
  }

  async findByName(name: string): Promise<Vendor | null> {
    return this.repository.findOne({
      where: { name } as FindOptionsWhere<Vendor>,
    });
  }

  async createVendor(data: IVendorCreate): Promise<Vendor> {
    // Check if vendor already exists
    const existingVendor = await this.findByName(data.name);
    if (existingVendor) {
      throw new ConflictError(`Vendor with name ${data.name} already exists`);
    }

    return this.create(data);
  }

  async updateVendor(id: string, data: IVendorUpdate): Promise<Vendor> {
    // Check if name is being changed and already exists
    if (data.name) {
      const existingVendor = await this.findByName(data.name);
      if (existingVendor && existingVendor.id !== id) {
        throw new ConflictError(`Vendor with name ${data.name} already exists`);
      }
    }

    return this.update(id, data);
  }
}

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(Category);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({
      where: { name } as FindOptionsWhere<Category>,
    });
  }

  async createCategory(name: string): Promise<Category> {
    // Check if category already exists
    const existingCategory = await this.findByName(name);
    if (existingCategory) {
      throw new ConflictError(`Category with name ${name} already exists`);
    }

    return this.create({ name });
  }

  async updateCategory(id: string, name: string): Promise<Category> {
    // Check if name is being changed and already exists
    const existingCategory = await this.findByName(name);
    if (existingCategory && existingCategory.id !== id) {
      throw new ConflictError(`Category with name ${name} already exists`);
    }

    return this.update(id, { name });
  }
}
