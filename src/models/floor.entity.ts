// floor.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Building } from './building.entity';
import { Room } from './room.entity';

@Entity('floors')
@Unique(['name', 'building_id'])
export class Floor {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column('varchar', { length: 36, name: 'building_id' })
  building_id: string;

  @ManyToOne(() => Building, building => building.floors)
  @JoinColumn({ name: 'building_id' })
  building: Building;

  @OneToMany(() => Room, room => room.floor)
  rooms: Room[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
