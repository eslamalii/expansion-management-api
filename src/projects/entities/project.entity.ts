import { Clients } from '../../clients/entities/client.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column('simple-array')
  services_needed: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @ManyToMany(() => Clients, (client) => client.projects)
  client: Clients;
}
