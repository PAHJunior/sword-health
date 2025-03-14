import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { IBaseRepository } from 'src/helpers/interfaces/base-repository.interface';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './repository/user.entity';
import { UserRoleEnum } from './dto/user-base.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<IBaseRepository<UserEntity, UserDto>>;

  beforeEach(async () => {
    userRepositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersDto: UserDto[] = [
        { userId: 1, username: 'JohnDoe', role: UserRoleEnum.TECHNICIAN },
        { userId: 2, username: 'Ana', role: UserRoleEnum.MANAGER },
      ];

      userRepositoryMock.findAll.mockResolvedValue(usersDto);

      const result = await userService.findAll();

      expect(result).toEqual(usersDto);
      expect(userRepositoryMock.findAll).toHaveBeenCalled();
    });
  });
});
