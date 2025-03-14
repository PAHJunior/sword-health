import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { UserTypeOrmRepository } from './repository/user-type-orm.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserTypeOrmRepository,
    },
    UserService,
    UserController,
  ],
  exports: [],
})
export class UserModule {}
