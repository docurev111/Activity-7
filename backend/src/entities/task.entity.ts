import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string; // 'todo', 'in-progress', 'completed'

  @Column({ type: 'date' })
  deadline: string;

  @Column()
  projectId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Project, project => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: User;
}
