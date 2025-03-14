import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as request from 'supertest';
import { UserRoleEnum } from './dto/user-base.dto';
import { AuthService } from '../../auth/auth.service';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { createMockRepository } from '../../helpers/test-utils/typeorm.mock';
import { UserEntity } from './repository/user.entity';
import { IBaseRepository } from 'src/helpers/interfaces/base-repository.interface';

describe('UserController', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userRepository: IBaseRepository<UserEntity>;
  const createMockRepo = createMockRepository<UserEntity>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'jest',
          signOptions: { expiresIn: `60s` },
        }),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: `UserRepository`,
          useValue: createMockRepo,
        },
        AuthService,
        JwtStrategy,
        Logger,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<IBaseRepository<UserEntity>>('UserRepository');
    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /user', () => {
    it('should return a list of users for admins', async () => {
      const { accessToken } = authService['generateAccessToken']({
        role: UserRoleEnum.MANAGER,
        sub: 1,
        username: 'pedro',
      });
      const expectedUsers: UserEntity[] = [
        {
          userId: 1,
          username: 'john_doe',
          role: UserRoleEnum.MANAGER,
        },
        {
          userId: 2,
          username: 'jane_smith',
          role: UserRoleEnum.TECHNICIAN,
        },
      ];

      jest.spyOn(userRepository, 'findAll').mockResolvedValue(expectedUsers);

      const response = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(expectedUsers);
    });
  });
});
