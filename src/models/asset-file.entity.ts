// asset-file.entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('asset_files')
export class AssetFile {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36, name: 'asset_id' })
  asset_id: string;

  @ManyToOne(() => Asset, asset => asset.files)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar', length: 100, name: 'mime_type' })
  mime_type: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
