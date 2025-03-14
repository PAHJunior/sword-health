import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTypeOrmRepository } from './user-type-orm.repository';
import { UserEntity } from './user.entity';

const mockUserEntity: UserEntity = {
  userId: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin',
} as unknown as UserEntity;

describe('UserTypeOrmRepository', () => {
  let repository: UserTypeOrmRepository;
  let userRepo: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTypeOrmRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUserEntity),
            findOneBy: jest.fn().mockResolvedValue(mockUserEntity),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockUserEntity]),
              addSelect: jest.fn().mockReturnThis(),
            })),
          },
        },
      ],
    }).compile();

    repository = module.get<UserTypeOrmRepository>(UserTypeOrmRepository);
    userRepo = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await repository.create(mockUserEntity);
    expect(result).toEqual(mockUserEntity);
    expect(userRepo.save).toHaveBeenCalledWith(mockUserEntity);
  });

  it('should update a user', async () => {
    await expect(repository.update(1, mockUserEntity)).resolves.toBeUndefined();
    expect(userRepo.update).toHaveBeenCalledWith(1, mockUserEntity);
  });

  it('should find all users', async () => {
    const result = await repository.findAll();
    expect(result).toEqual([mockUserEntity]);
  });

  it('should find user by id', async () => {
    const result = await repository.findById(1);
    expect(result).toEqual(mockUserEntity);
  });

  it('should delete a user', async () => {
    await expect(repository.delete(1)).resolves.toBeUndefined();
    expect(userRepo.delete).toHaveBeenCalledWith(1);
  });
});
