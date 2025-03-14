import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskStatusEnum } from '../dto/task-base.dto';
import { UserEntity } from '../../../features/user/repository/user.entity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn({
    name: 'task_id',
  })
  taskId: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({ type: 'varchar', length: 2500 })
  summary: string;

  @Column({ type: 'timestamp', name: 'performed_at' })
  performedAt: Date;

  @Column({ type: 'enum', enum: TaskStatusEnum })
  status: TaskStatusEnum;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.tasks) // Supondo que exista uma tabela User
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
