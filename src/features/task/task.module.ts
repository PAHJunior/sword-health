import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { TaskService } from './task.service';
import { TaskTypeOrmRepository } from './repository/task-type-orm.repository';
import { TaskController } from './task.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: 'TaskRepository',
      useClass: TaskTypeOrmRepository,
    },
  ],
  exports: [],
})
export class TaskModule {}
