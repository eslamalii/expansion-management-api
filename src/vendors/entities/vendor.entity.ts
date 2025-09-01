import { Match } from '../../matches/entities/match.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum VendorStatus {
  ACTIVE = 'active',
  FLAGGED = 'flagged',
  SUSPENDED = 'suspended',
}

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  countries_supported: string[];

  @Column('json')
  services_offered: string[];

  @Column('decimal', { precision: 2, scale: 1 })
  rating: number;

  @Column()
  response_sla_hours: number;

  @Column({
    type: 'enum',
    enum: VendorStatus,
    default: VendorStatus.ACTIVE,
  })
  status: VendorStatus;

  @OneToMany(() => Match, (match) => match.vendor)
  matches: Match[];
}
