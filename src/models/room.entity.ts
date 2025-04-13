// room.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Floor } from './floor.entity';
import { Asset } from './asset.entity';

@Entity('rooms')
@Unique(['name', 'floor_id'])
export class Room {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'floor_id', length: 36 })
  floor_id: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @ManyToOne(() => Floor, floor => floor.rooms)
  @JoinColumn({ name: 'floor_id' })
  floor: Floor;

  @OneToMany(() => Asset, asset => asset.room)
  assets: Asset[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
