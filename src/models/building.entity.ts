// building.entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Floor } from './floor.entity';

@Entity('buildings')
export class Building {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Floor, floor => floor.building)
  floors: Floor[];
}
