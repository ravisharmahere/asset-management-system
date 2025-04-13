// index.ts
export * from './asset.service';
export * from './location.service';

import { assetService } from './asset.service';
import { locationService } from './location.service';

export const services = {
  asset: assetService,
  location: locationService,
};
