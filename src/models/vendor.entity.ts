// vendor.entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Asset, asset => asset.vendor)
  assets: Asset[];
}
