// asset.interface.ts
import { AssetCondition, AssetOwnership, AssetStatus } from '../models/asset.entity';
import { IRoom } from './location.interface';
import { ICategory } from './common.interface';

export interface IAssetImage {
  id: string;
  asset_id: string;
  url: string;
  thumbnail_url: string;
  filename: string;
  size: number;
  mime_type: string;
  created_at: Date;
}

export interface IAssetFile {
  id: string;
  asset_id: string;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  category: string;
  created_at: Date;
}

export interface IAssetHistory {
  id: string;
  asset_id: string;
  action: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  created_at: Date;
}

export interface IVendor {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface IAsset {
  id: string;
  name: string;
  code: string;
  category_id: string;
  category?: ICategory;
  room_id: string;
  room?: IRoom;
  status: AssetStatus;
  condition: AssetCondition;
  brand?: string;
  model?: string;
  linked_asset_id?: string;
  linkedAsset?: IAsset;
  description?: string;
  cwip_invoice_id?: string;

  // Purchase information
  vendor_id?: string;
  vendor?: IVendor;
  po_number?: string;
  invoice_date?: Date;
  invoice_number?: string;
  purchase_date?: Date;
  purchase_price?: number;
  ownership: AssetOwnership;

  // Financial information
  capitalization_price?: number;
  end_of_life?: Date;
  capitalization_date?: Date;
  depreciation_percentage?: number;
  accumulated_depreciation?: number;
  scrap_value?: number;
  income_tax_depreciation_percentage?: number;

  // Relations
  images?: IAssetImage[];
  files?: IAssetFile[];
  history?: IAssetHistory[];

  // Metadata
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
}

export interface IAssetCreate {
  name: string;
  code?: string; // Can be auto-generated
  category_id: string;
  room_id: string;
  status: AssetStatus;
  condition: AssetCondition;
  brand?: string;
  model?: string;
  linked_asset_id?: string;
  description?: string;
  cwip_invoice_id?: string;
  vendor_id?: string;
  po_number?: string;
  invoice_date?: Date;
  invoice_number?: string;
  purchase_date?: Date;
  purchase_price?: number;
  ownership: AssetOwnership;
  capitalization_price?: number;
  end_of_life?: Date;
  capitalization_date?: Date;
  depreciation_percentage?: number;
  accumulated_depreciation?: number;
  scrap_value?: number;
  income_tax_depreciation_percentage?: number;
}

export interface IAssetUpdate {
  name?: string;
  code?: string;
  category_id?: string;
  room_id?: string;
  status?: AssetStatus;
  condition?: AssetCondition;
  brand?: string;
  model?: string;
  linked_asset_id?: string;
  description?: string;
  cwip_invoice_id?: string;
  vendor_id?: string;
  po_number?: string;
  invoice_date?: Date;
  invoice_number?: string;
  purchase_date?: Date;
  purchase_price?: number;
  ownership?: AssetOwnership;
  capitalization_price?: number;
  end_of_life?: Date;
  capitalization_date?: Date;
  depreciation_percentage?: number;
  accumulated_depreciation?: number;
  scrap_value?: number;
  income_tax_depreciation_percentage?: number;
}

export interface IVendorCreate {
  name: string;
}

export interface IVendorUpdate {
  name?: string;
}

export interface IAssetImageCreate {
  asset_id: string;
  file: Express.Multer.File;
}

export interface IAssetFileCreate {
  asset_id: string;
  category: string;
  file: Express.Multer.File;
}
