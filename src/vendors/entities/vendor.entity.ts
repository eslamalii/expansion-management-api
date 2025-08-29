import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-array')
  countries_supported: string[];

  @Column('simple-array')
  services_offered: string[];

  @Column('decimal', { precision: 2, scale: 1 })
  rating: number;

  @Column()
  response_sla_hours: number;
}
