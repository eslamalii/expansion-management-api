import { Project } from '../../projects/entities/project.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  company_name: string;

  @Column({ unique: true })
  contact_email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'client' })
  role: string;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];
}
