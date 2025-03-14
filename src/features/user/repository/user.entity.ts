import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRoleEnum } from '../dto/user-base.dto';
import { TaskEntity } from '../../../features/task/repository/task.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({
    name: 'user_id',
  })
  userId: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    select: false,
  })
  password?: string;

  @Column({
    select: false,
    nullable: true,
  })
  refreshToken?: string;

  @Column({
    enum: UserRoleEnum,
    type: 'enum',
    default: UserRoleEnum.TECHNICIAN,
  })
  role: UserRoleEnum;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks?: TaskEntity[];
}
