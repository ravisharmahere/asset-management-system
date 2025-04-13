// asset-image.entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('asset_images')
export class AssetImage {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36, name: 'asset_id' })
  asset_id: string;

  @ManyToOne(() => Asset, asset => asset.images)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ length: 255 })
  url: string;

  @Column({ length: 255, name: 'thumbnail_url' })
  thumbnail_url: string;

  @Column({ length: 255 })
  filename: string;

  @Column('int')
  size: number;

  @Column({ length: 100, name: 'mime_type' })
  mime_type: string;

  @CreateDateColumn()
  created_at: Date;
}
