// asset.service.ts
import { repositories } from '../repositories';
import { generateUUID, generateAssetCode } from '../utils/helpers';
import {
  IAssetCreate,
  IAssetUpdate,
  IVendorCreate,
  IVendorUpdate,
  IPaginationQuery,
  IAssetImageCreate,
  IAssetFileCreate,
} from '../interfaces';
import { NotFoundError, ConflictError } from '../utils/error';
import { getFileUrl, generateThumbnail } from '../utils/file-upload';
import { AssetCondition, AssetStatus } from './../models';
import { AssetHistory } from '../models/asset-history.entity';
import { MySQLDatabase } from '../database';

export class AssetService {
  /**
   * Get all assets with filtering and pagination
   */
  async getAllAssets(options?: {
    status?: AssetStatus;
    condition?: AssetCondition;
    categoryId?: string;
    roomId?: string;
    search?: string;
    purchaseStartDate?: string;
    purchaseEndDate?: string;
    pagination?: IPaginationQuery;
  }) {
    // Parse dates if provided
    let purchaseStartDate, purchaseEndDate;

    if (options?.purchaseStartDate) {
      purchaseStartDate = new Date(options.purchaseStartDate);
    }

    if (options?.purchaseEndDate) {
      purchaseEndDate = new Date(options.purchaseEndDate);
    }

    return repositories.asset.findAllAssets({
      ...options,
      purchaseStartDate,
      purchaseEndDate,
    });
  }

  /**
   * Get asset by ID with full details
   */
  async getAssetById(id: string) {
    return repositories.asset.findAssetById(id);
  }

  /**
   * Create new asset
   */
  async createAsset(assetData: IAssetCreate) {
    // Check if asset with same name already exists
    const existingAsset = await repositories.asset.findOne({
      where: { name: assetData.name },
    });

    if (existingAsset) {
      throw new ConflictError(`Asset with name '${assetData.name}' already exists`);
    }

    // Generate UUID
    const id = generateUUID();

    // Generate asset code if not provided
    if (!assetData.code) {
      assetData.code = generateAssetCode();
    }

    // Create asset
    const asset = await repositories.asset.createAsset({
      ...assetData,
      id,
    } as any);

    // Add to history
    await repositories.asset.addAssetHistory(id, {
      action: 'Created',
    });

    return asset;
  }

  /**
   * Update existing asset
   */
  async updateAsset(id: string, assetData: IAssetUpdate) {
    const originalAsset = await repositories.asset.findAssetById(id);

    // Update asset
    const updatedAsset = await repositories.asset.updateAsset(id, assetData);

    // Add changes to history
    for (const [key, newValue] of Object.entries(assetData)) {
      if (newValue !== undefined && (originalAsset as any)[key] !== newValue) {
        await repositories.asset.addAssetHistory(id, {
          action: 'Updated',
          field_name: key,
          old_value: String((originalAsset as any)[key] || ''),
          new_value: String(newValue),
        });
      }
    }

    return updatedAsset;
  }

  /**
   * Delete asset
   */
  async deleteAsset(id: string) {
    const asset = await repositories.asset.findById(id);

    // Delete asset history records first
    const dataSource = MySQLDatabase.getInstance().getDataSource();
    await dataSource.getRepository(AssetHistory).delete({ asset_id: id });

    // Delete asset
    await repositories.asset.delete(id);

    return { success: true };
  }

  /**
   * Update asset status
   */
  async updateAssetStatus(id: string, status: AssetStatus) {
    const asset = await repositories.asset.findById(id);
    const oldStatus = asset.status;

    if (oldStatus === status) {
      return asset; // No change
    }

    // Update status
    const updatedAsset = await repositories.asset.update(id, {
      status,
    });

    // Add to history
    await repositories.asset.addAssetHistory(id, {
      action: 'Status Change',
      field_name: 'status',
      old_value: oldStatus,
      new_value: status,
    });

    return updatedAsset;
  }

  /**
   * Update asset condition
   */
  async updateAssetCondition(id: string, condition: AssetCondition) {
    const asset = await repositories.asset.findById(id);
    const oldCondition = asset.condition;

    if (oldCondition === condition) {
      return asset; // No change
    }

    // Update condition
    const updatedAsset = await repositories.asset.update(id, {
      condition,
    });

    // Add to history
    await repositories.asset.addAssetHistory(id, {
      action: 'Condition Change',
      field_name: 'condition',
      old_value: oldCondition,
      new_value: condition,
    });

    return updatedAsset;
  }

  /**
   * Add image to asset
   */
  async addAssetImage(data: IAssetImageCreate) {
    const { asset_id, file } = data;

    // Get asset to verify it exists
    await repositories.asset.findById(asset_id);

    // Generate image URL
    const url = getFileUrl(file.filename, true);

    // Generate thumbnail
    const thumbnailUrl = await generateThumbnail(file.path);

    // Add image to database
    return repositories.asset.addAssetImage(asset_id, {
      url,
      thumbnail_url: thumbnailUrl,
      filename: file.originalname,
      size: file.size,
      mime_type: file.mimetype,
    });
  }

  /**
   * Add file to asset
   */
  async addAssetFile(data: IAssetFileCreate) {
    const { asset_id, category, file } = data;

    // Get asset to verify it exists
    await repositories.asset.findById(asset_id);

    // Generate file URL
    const url = getFileUrl(file.filename, false);

    // Add file to database
    return repositories.asset.addAssetFile(asset_id, {
      url,
      filename: file.originalname,
      size: file.size,
      mime_type: file.mimetype,
      category,
    });
  }

  /**
   * Get asset history
   */
  async getAssetHistory(assetId: string) {
    return repositories.asset.getAssetHistory(assetId);
  }

  /* Category methods */

  async getAllCategories(pagination?: IPaginationQuery) {
    return repositories.category.findAll({ pagination });
  }

  async getCategoryById(id: string) {
    return repositories.category.findById(id);
  }

  async createCategory(name: string) {
    return repositories.category.createCategory(name);
  }

  async updateCategory(id: string, name: string) {
    return repositories.category.updateCategory(id, name);
  }

  async deleteCategory(id: string) {
    return repositories.category.delete(id);
  }

  /* Vendor methods */

  async getAllVendors(pagination?: IPaginationQuery) {
    return repositories.vendor.findAll({ pagination });
  }

  async getVendorById(id: string) {
    return repositories.vendor.findById(id);
  }

  async createVendor(data: IVendorCreate) {
    return repositories.vendor.createVendor(data);
  }

  async updateVendor(id: string, data: IVendorUpdate) {
    return repositories.vendor.updateVendor(id, data);
  }

  async deleteVendor(id: string) {
    return repositories.vendor.delete(id);
  }
}

export const assetService = new AssetService();
