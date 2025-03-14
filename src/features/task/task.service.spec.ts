import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { IBaseRepository } from '../../helpers/interfaces/base-repository.interface';
import { TaskEntity } from './repository/task.entity';
import { TaskCreateRequestDto } from './dto/task-create.dto';
import { TaskDto } from './dto/task.dto';
import { UserRoleEnum } from '../user/dto/user-base.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TaskStatusEnum } from './dto/task-base.dto';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: jest.Mocked<IBaseRepository<TaskEntity>>;

  beforeEach(async () => {
    const taskRepositoryMock: jest.Mocked<IBaseRepository<TaskEntity>> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: 'TaskRepository', useValue: taskRepositoryMock },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get('TaskRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const payload: TaskCreateRequestDto = {
        userId: 1,
        summary: 'Test Task',
        status: TaskStatusEnum.PENDING,
      };
      const taskEntity: TaskEntity = {
        ...payload,
        taskId: 1,
        user: {
          role: UserRoleEnum.ADMIN,
          userId: 1,
          username: 'pedro',
        },
      } as TaskEntity;
      taskRepository.create.mockResolvedValue(taskEntity);

      const result = await service.create(payload, 1, UserRoleEnum.ADMIN);

      expect(taskRepository.create).toHaveBeenCalledWith({
        ...payload,
        userId: 1,
      });
      expect(result).toMatchObject({
        taskId: 1,
        userId: 1,
        summary: 'Test Task',
      });
    });

    it('should throw ForbiddenException if TECHNICIAN tries to create task for another user', async () => {
      const payload: TaskCreateRequestDto = {
        userId: 2,
        summary: 'Test Task',
        status: TaskStatusEnum.PENDING,
      };
      await expect(
        service.create(payload, 1, UserRoleEnum.TECHNICIAN),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskEntity: TaskEntity = {
        taskId: 1,
        userId: 1,
        summary: 'Old Task',
        user: {
          role: UserRoleEnum.ADMIN,
          userId: 1,
          username: 'pedro',
        },
      } as TaskEntity;
      taskRepository.findById.mockResolvedValue(taskEntity);
      taskRepository.update.mockResolvedValue(undefined);
      taskRepository.findById.mockResolvedValue({
        ...taskEntity,
        summary: 'Updated Task',
      });

      const result = await service.update(
        1,
        { summary: 'Updated Task' },
        1,
        UserRoleEnum.ADMIN,
      );

      expect(result.summary).toBe('Updated Task');
    });

    it('should throw NotFoundException if task does not exist', async () => {
      taskRepository.findById.mockResolvedValue(null);
      await expect(
        service.update(1, { summary: 'Updated Task' }, 1, UserRoleEnum.ADMIN),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if task does not exist', async () => {
      taskRepository.findById.mockResolvedValue(null);
      await expect(service.remove(1, 1, UserRoleEnum.ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw ForbiddenException if TECHNICIAN tries to remove another user's task", async () => {
      const taskEntity: TaskEntity = { taskId: 1, userId: 2 } as TaskEntity;
      taskRepository.findById.mockResolvedValue(taskEntity);
      await expect(
        service.remove(1, 1, UserRoleEnum.TECHNICIAN),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
