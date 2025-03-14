import { Logger, Module } from '@nestjs/common';
import { NotifyController } from './notify.controller';
import { ClientsModule } from '@nestjs/microservices';
import { NotifyService } from './notify.service';
import { RmqOptionsConfig } from '../../infra/rmq/rmq.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFY_SERVICE',
        ...RmqOptionsConfig,
      },
    ]),
  ],
  controllers: [NotifyController],
  providers: [Logger, NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
