// asset.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Room } from './room.entity';
import { Vendor } from './vendor.entity';
import { AssetImage } from './asset-image.entity';
import { AssetFile } from './asset-file.entity';
import { AssetHistory } from './asset-history.entity';

export enum AssetStatus {
  IN_USE = 'In Use',
  IN_STOCK = 'In Stock',
  OUT_FOR_REPAIR = 'Out for Repair',
  RETIRED = 'Retired',
  LOST = 'Lost',
}

export enum AssetCondition {
  NEW = 'New',
  GOOD = 'Good',
  DAMAGED = 'Damaged',
  POOR = 'Poor',
}

export enum AssetOwnership {
  SELF_OWNED = 'Self-Owned',
  PARTNER = 'Partner',
}

@Entity('assets')
export class Asset {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column('varchar', { length: 36, name: 'category_id' })
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('varchar', { length: 36, name: 'room_id' })
  room_id: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({
    type: 'enum',
    enum: AssetStatus,
  })
  status: AssetStatus;

  @Column({
    type: 'enum',
    enum: AssetCondition,
  })
  condition: AssetCondition;

  @Column({ length: 50, nullable: true })
  brand: string;

  @Column({ length: 50, nullable: true })
  model: string;

  @Column('varchar', { length: 36, name: 'linked_asset_id', nullable: true })
  linked_asset_id: string | null;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'linked_asset_id' })
  linkedAsset: Asset | null;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 50, nullable: true, name: 'cwip_invoice_id' })
  cwip_invoice_id: string;

  // Purchase information
  @Column('varchar', { length: 36, name: 'vendor_id', nullable: true })
  vendor_id: string | null;

  @ManyToOne(() => Vendor, { nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor | null;

  @Column({ length: 20, nullable: true, name: 'po_number' })
  po_number: string;

  @Column({ type: 'date', nullable: true, name: 'invoice_date' })
  invoice_date: Date;

  @Column({ length: 50, nullable: true, name: 'invoice_number' })
  invoice_number: string;

  @Column({ type: 'date', nullable: true, name: 'purchase_date' })
  purchase_date: Date;

  @Column('decimal', { precision: 15, scale: 2, nullable: true, name: 'purchase_price' })
  purchase_price: number;

  @Column({
    type: 'enum',
    enum: AssetOwnership,
  })
  ownership: AssetOwnership;

  // Financial information
  @Column('decimal', { precision: 15, scale: 2, nullable: true, name: 'capitalization_price' })
  capitalization_price: number;

  @Column({ type: 'date', nullable: true, name: 'end_of_life' })
  end_of_life: Date;

  @Column({ type: 'date', nullable: true, name: 'capitalization_date' })
  capitalization_date: Date;

  @Column('decimal', { precision: 5, scale: 2, nullable: true, name: 'depreciation_percentage' })
  depreciation_percentage: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true, name: 'accumulated_depreciation' })
  accumulated_depreciation: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0, name: 'scrap_value' })
  scrap_value: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true, name: 'income_tax_depreciation_percentage' })
  income_tax_depreciation_percentage: number;

  // Relations
  @OneToMany(() => AssetImage, image => image.asset)
  images: AssetImage[];

  @OneToMany(() => AssetFile, file => file.asset)
  files: AssetFile[];

  @OneToMany(() => AssetHistory, history => history.asset)
  history: AssetHistory[];

  // Metadata
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('varchar', { length: 36, name: 'created_by' })
  created_by: string;
}
