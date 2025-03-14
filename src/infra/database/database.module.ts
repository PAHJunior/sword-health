import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnection } from './database-connection.helper';
import { UserEntity } from '../../features/user/repository/user.entity';
import { TaskEntity } from '../../features/task/repository/task.entity';

@Module({
  imports: [
    DatabaseConnection,
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
  ],
  exports: [
    DatabaseConnection,
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
  ],
})
export class DatabaseModule {}
