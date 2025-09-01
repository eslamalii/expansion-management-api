import { Vendor } from '../../vendors/entities/vendor.entity';
import { Project } from '../../projects/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MatchStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.PENDING,
  })
  status: MatchStatus;

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
