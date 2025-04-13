// asset-history.entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('asset_history')
export class AssetHistory {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36, name: 'asset_id' })
  asset_id: string;

  @ManyToOne(() => Asset, asset => asset.history)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 50, nullable: true, name: 'field_name' })
  field_name: string;

  @Column('text', { nullable: true, name: 'old_value' })
  old_value: string;

  @Column('text', { nullable: true, name: 'new_value' })
  new_value: string;

  @CreateDateColumn()
  created_at: Date;
}
