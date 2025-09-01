import { Vendor } from '../../vendors/entities/vendor.entity';
import { Project } from '../../projects/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @ManyToOne(() => Project, (project) => project.matches, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => Vendor, (vendor) => vendor.matches, {
    onDelete: 'CASCADE',
  })
  vendor: Vendor;

  @CreateDateColumn()
  create_at: Date;
}
