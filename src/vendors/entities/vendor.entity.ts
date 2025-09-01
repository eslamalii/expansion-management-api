import { Match } from '../../matches/entities/match.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Match, (match) => match.vendor)
  matches: Match[];
}
