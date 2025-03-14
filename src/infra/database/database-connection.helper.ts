import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectEnvironment } from '../../helpers/inject-environment';
import { UserEntity } from '../../features//user/repository/user.entity';
import { TaskEntity } from '../../features//task/repository/task.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  @InjectEnvironment({
    key: 'DB_NAME',
  })
  private DB_NAME!: string;

  @InjectEnvironment({
    key: 'DB_HOST',
  })
  private DB_HOST!: string;

  @InjectEnvironment({
    key: 'DB_PORT',
  })
  private DB_PORT!: string;

  @InjectEnvironment({
    key: 'DB_USERNAME',
  })
  private DB_USERNAME!: string;

  @InjectEnvironment({
    key: 'DB_PASSWORD',
  })
  private DB_PASSWORD!: string;

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: this.DB_HOST,
      port: parseInt(this.DB_PORT, 10),
      username: this.DB_USERNAME,
      password: this.DB_PASSWORD,
      database: this.DB_NAME,
      entities: [UserEntity, TaskEntity],
      logging: false,
      synchronize: true, // TODO: Create a folder for migration files.
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
  ],
})
export class DatabaseConnection {}
