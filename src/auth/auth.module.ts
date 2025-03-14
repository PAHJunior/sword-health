import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiAuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserTypeOrmRepository } from '../features/user/repository/user-type-orm.repository';
import { DatabaseModule } from '../infra/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRATION_TIME}s` },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ApiAuthGuard,
    JwtStrategy,
    Logger,
    {
      provide: 'UserRepository',
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [ApiAuthGuard],
})
export class AuthModule {}
