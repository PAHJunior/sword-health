import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { BadRequestException } from '@nestjs/common';
import { TaskStatusEnum } from '../dto/task-base.dto';
import { TaskTypeOrmRepository } from './task-type-orm.repository';

const mockTaskEntity: TaskEntity = {
  taskId: 1,
  title: 'Test Task',
  description: 'This is a test task',
  user: { username: 'testuser', role: 'admin' },
  userId: 1,
  status: TaskStatusEnum.COMPLETED,
} as unknown as TaskEntity;

describe('TaskTypeOrmRepository', () => {
  let repository: TaskTypeOrmRepository;
  let taskRepo: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskTypeOrmRepository,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(mockTaskEntity),
            findOne: jest.fn().mockResolvedValue(mockTaskEntity),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(mockTaskEntity),
              getMany: jest.fn().mockResolvedValue([mockTaskEntity]),
              addSelect: jest.fn().mockReturnThis(),
            })),
          },
        },
      ],
    }).compile();

    repository = module.get<TaskTypeOrmRepository>(TaskTypeOrmRepository);
    taskRepo = module.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a task', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(mockTaskEntity);
    const result = await repository.create(mockTaskEntity);
    expect(result).toEqual(mockTaskEntity);
    expect(taskRepo.save).toHaveBeenCalledWith(mockTaskEntity);
  });

  it('should throw BadRequestException when task is not found after creation', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);
    await expect(repository.create(mockTaskEntity)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a task', async () => {
    await expect(repository.update(1, mockTaskEntity)).resolves.toBeUndefined();
    expect(taskRepo.update).toHaveBeenCalledWith(1, mockTaskEntity);
  });

  it('should find all tasks', async () => {
    const result = await repository.findAll();
    expect(result).toEqual([mockTaskEntity]);
  });

  it('should find task by id', async () => {
    const result = await repository.findById(1);
    expect(result).toEqual(mockTaskEntity);
  });

  it('should delete a task', async () => {
    await expect(repository.delete(1)).resolves.toBeUndefined();
    expect(taskRepo.delete).toHaveBeenCalledWith(1);
  });
});
