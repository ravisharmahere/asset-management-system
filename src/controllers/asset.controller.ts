// asset.controller.ts
import { Request, Response } from 'express';
import { services } from '../services';
import { asyncHandler } from '../utils/error';
import { upload } from '../utils/file-upload';
import { IPaginationQuery } from '../interfaces';
import { AssetCondition, AssetStatus } from '../models/asset.entity';
import { BadRequestError, SuccessResponse, SuccessMsgResponse } from './../core';

export class AssetController {
  /**
   * Get all assets with filtering and pagination
   */
  getAllAssets = asyncHandler(async (req: Request, res: Response) => {
    const pagination: IPaginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: (req.query.sort as string) || 'created_at',
      order: (req.query.order as 'ASC' | 'DESC') || 'DESC',
    };

    const filters = {
      status: req.query.status as AssetStatus,
      condition: req.query.condition as AssetCondition,
      categoryId: req.query.categoryId as string,
      roomId: req.query.roomId as string,
      search: req.query.search as string,
      purchaseStartDate: req.query.purchaseStartDate as string,
      purchaseEndDate: req.query.purchaseEndDate as string,
      pagination,
    };

    const assets = await services.asset.getAllAssets(filters);

    return new SuccessResponse('Assets retrieved successfully', assets).send(res);
  });

  /**
   * Get asset by ID
   */
  getAssetById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const asset = await services.asset.getAssetById(id);

    return new SuccessResponse('Asset retrieved successfully', asset).send(res);
  });

  /**
   * Create new asset
   */
  createAsset = asyncHandler(async (req: Request, res: Response) => {
    const {
      name,
      description,
      categoryId,
      status,
      condition,
      purchaseDate,
      purchasePrice,
      vendorId,
      locationId,
      roomId,
      serialNumber,
      modelNumber,
      warrantyExpiryDate,
      ownership = 'Self-Owned', // Default value
    } = req.body;

    // Validate required fields
    if (!name) {
      throw new BadRequestError('Name is required');
    }
    if (!categoryId) {
      throw new BadRequestError('Category ID is required');
    }
    if (!roomId) {
      throw new BadRequestError('Room ID is required');
    }
    if (!status) {
      throw new BadRequestError('Status is required');
    }
    if (!condition) {
      throw new BadRequestError('Condition is required');
    }

    // Check if category exists
    const category = await services.asset.getCategoryById(categoryId);
    if (!category) {
      throw new BadRequestError(`Category with ID ${categoryId} does not exist`);
    }

    // Check if vendor exists if provided
    if (vendorId) {
      const vendor = await services.asset.getVendorById(vendorId);
      if (!vendor) {
        throw new BadRequestError(`Vendor with ID ${vendorId} does not exist`);
      }
    }

    // Check if room exists
    const room = await services.location.getRoomById(roomId);
    if (!room) {
      throw new BadRequestError(`Room with ID ${roomId} does not exist`);
    }

    // Map the request data to the entity fields
    const assetData = {
      name,
      description,
      category_id: categoryId,
      room_id: roomId,
      status,
      condition,
      purchase_date: purchaseDate ? new Date(purchaseDate) : undefined,
      purchase_price: purchasePrice,
      vendor_id: vendorId,
      serial_number: serialNumber,
      model_number: modelNumber,
      warranty_expiry_date: warrantyExpiryDate ? new Date(warrantyExpiryDate) : undefined,
      ownership,
      created_by: 'system', // You might want to get this from the authenticated user
    };

    const asset = await services.asset.createAsset(assetData);

    return new SuccessResponse('Asset created successfully', asset).send(res);
  });

  /**
   * Update asset
   */
  updateAsset = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const assetData = req.body;

    const asset = await services.asset.updateAsset(id, assetData);

    return new SuccessResponse('Asset updated successfully', asset).send(res);
  });

  /**
   * Delete asset
   */
  deleteAsset = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    await services.asset.deleteAsset(id);

    return new SuccessMsgResponse('Asset deleted successfully').send(res);
  });

  /**
   * Update asset status
   */
  updateAssetStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body;

    const asset = await services.asset.updateAssetStatus(id, status);

    return new SuccessResponse('Asset status updated successfully', asset).send(res);
  });

  /**
   * Update asset condition
   */
  updateAssetCondition = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { condition } = req.body;

    const asset = await services.asset.updateAssetCondition(id, condition);

    return new SuccessResponse('Asset condition updated successfully', asset).send(res);
  });

  /**
   * Upload asset image
   */
  uploadAssetImage = [
    upload.single('image'),
    asyncHandler(async (req: Request, res: Response) => {
      const assetId = req.params.id;
      const file = req.file;

      if (!file) {
        throw new BadRequestError('No file provided');
      }

      const image = await services.asset.addAssetImage({
        asset_id: assetId,
        file: file,
      });

      return new SuccessResponse('Asset image uploaded successfully', image).send(res);
    }),
  ];

  /**
   * Upload asset file (document)
   */
  uploadAssetFile = [
    upload.single('file'),
    asyncHandler(async (req: Request, res: Response) => {
      const assetId = req.params.id;
      const file = req.file;
      const { category } = req.body;

      if (!file) {
        throw new BadRequestError('No file provided');
      }

      const assetFile = await services.asset.addAssetFile({
        asset_id: assetId,
        file: file,
        category,
      });

      return new SuccessResponse('Asset file uploaded successfully', assetFile).send(res);
    }),
  ];

  /**
   * Get asset history
   */
  getAssetHistory = asyncHandler(async (req: Request, res: Response) => {
    const assetId = req.params.id;
    const history = await services.asset.getAssetHistory(assetId);

    return new SuccessResponse('Asset history retrieved successfully', history).send(res);
  });

  /* Category endpoints */

  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const pagination: IPaginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: (req.query.sort as string) || 'name',
      order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
    };

    const categories = await services.asset.getAllCategories(pagination);

    return new SuccessResponse('Categories retrieved successfully', categories).send(res);
  });

  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const category = await services.asset.getCategoryById(id);

    return new SuccessResponse('Category retrieved successfully', category).send(res);
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await services.asset.createCategory(name);

    return new SuccessResponse('Category created successfully', category).send(res);
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    const category = await services.asset.updateCategory(id, name);

    return new SuccessResponse('Category updated successfully', category).send(res);
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await services.asset.deleteCategory(id);

    return new SuccessMsgResponse('Category deleted successfully').send(res);
  });

  /* Vendor endpoints */

  getAllVendors = asyncHandler(async (req: Request, res: Response) => {
    const pagination: IPaginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: (req.query.sort as string) || 'name',
      order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
    };

    const vendors = await services.asset.getAllVendors(pagination);

    return new SuccessResponse('Vendors retrieved successfully', vendors).send(res);
  });

  getVendorById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const vendor = await services.asset.getVendorById(id);

    return new SuccessResponse('Vendor retrieved successfully', vendor).send(res);
  });

  createVendor = asyncHandler(async (req: Request, res: Response) => {
    const vendorData = req.body;
    const vendor = await services.asset.createVendor(vendorData);

    return new SuccessResponse('Vendor created successfully', vendor).send(res);
  });

  updateVendor = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const vendorData = req.body;
    const vendor = await services.asset.updateVendor(id, vendorData);

    return new SuccessResponse('Vendor updated successfully', vendor).send(res);
  });

  deleteVendor = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await services.asset.deleteVendor(id);

    return new SuccessMsgResponse('Vendor deleted successfully').send(res);
  });
}

export const assetController = new AssetController();
