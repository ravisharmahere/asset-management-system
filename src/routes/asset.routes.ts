// routes.ts
import { Router } from 'express';
import { AssetController } from '../controllers';

export class AssetRoutes {
  readonly router = Router();
  readonly controller = new AssetController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    /**
     * Category routes
     */
    this.router.get('/categories', this.controller.getAllCategories);
    this.router.get('/categories/:id', this.controller.getCategoryById);
    this.router.post('/categories', this.controller.createCategory);
    this.router.put('/categories/:id', this.controller.updateCategory);
    this.router.delete('/categories/:id', this.controller.deleteCategory);

    /**
     * Vendor routes
     */
    this.router.get('/vendors', this.controller.getAllVendors);
    this.router.get('/vendors/:id', this.controller.getVendorById);
    this.router.post('/vendors', this.controller.createVendor);
    this.router.put('/vendors/:id', this.controller.updateVendor);
    this.router.delete('/vendors/:id', this.controller.deleteVendor);

    /**
     * Asset routes
     */
    this.router.get('/', this.controller.getAllAssets);
    this.router.post('/', this.controller.createAsset);
    this.router.get('/:id', this.controller.getAssetById);
    this.router.put('/:id', this.controller.updateAsset);
    this.router.delete('/:id', this.controller.deleteAsset);
    this.router.patch('/:id/status', this.controller.updateAssetStatus);
    this.router.patch('/:id/condition', this.controller.updateAssetCondition);
    this.router.post('/:id/images', ...this.controller.uploadAssetImage);
    this.router.post('/:id/files', ...this.controller.uploadAssetFile);
    this.router.get('/:id/history', this.controller.getAssetHistory);
  }
}
