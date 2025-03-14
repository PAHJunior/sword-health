import { Logger, Module } from '@nestjs/common';
import { UserModule } from './features/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { QueryFailedExceptionFilter } from './helpers/query-failed.exception';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './helpers/guards/roles.guard';
import { ApiAuthGuard } from './auth/auth.guard';
import { TaskModule } from './features/task/task.module';
import { NotifyModule } from './features/notify/notify.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    TaskModule,
    NotifyModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: QueryFailedExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ApiAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
