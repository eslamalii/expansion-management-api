import { Project } from '../../projects/entities/project.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Clients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  company_name: string;

  @Column({ unique: true })
  contact_email: string;

  @Column()
  password: string;

  @Column({ default: 'client' })
  role: string;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];
}
