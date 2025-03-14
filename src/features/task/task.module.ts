import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { TaskService } from './task.service';
import { TaskTypeOrmRepository } from './repository/task-type-orm.repository';
import { TaskController } from './task.controller';
import { NotifyModule } from '../notify/notify.module';

@Module({
  imports: [DatabaseModule, NotifyModule],
  controllers: [TaskController],
  providers: [
    TaskService,
    Logger,
    {
      provide: 'TaskRepository',
      useClass: TaskTypeOrmRepository,
    },
  ],
  exports: [],
})
export class TaskModule {}
