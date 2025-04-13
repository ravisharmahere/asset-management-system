// index.ts
export * from './base.repository';
export * from './asset.repository';
export * from './location.repository';

// Export repository instances for easy access
import { AssetRepository, VendorRepository, CategoryRepository } from './asset.repository';
import { BuildingRepository, FloorRepository, RoomRepository } from './location.repository';

export const repositories = {
  asset: new AssetRepository(),
  vendor: new VendorRepository(),
  category: new CategoryRepository(),
  building: new BuildingRepository(),
  floor: new FloorRepository(),
  room: new RoomRepository(),
};
