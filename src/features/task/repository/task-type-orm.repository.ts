import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBaseRepository } from 'src/helpers/interfaces/base-repository.interface';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskTypeOrmRepository implements IBaseRepository<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  public async create(payload: TaskEntity): Promise<TaskEntity> {
    const createTask = await this.taskRepository.save(payload);
    const task = await this.findById(createTask.taskId);
    if (!task) {
      throw new BadRequestException();
    }

    return task;
  }

  public async update(taskId: number, payload: TaskEntity): Promise<void> {
    await this.taskRepository.update(taskId, payload);
  }

  public findAll(
    filters?: Partial<TaskEntity>,
    selectFields?: (keyof TaskEntity)[],
  ): Promise<TaskEntity[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('tasks');
    queryBuilder.leftJoinAndSelect('tasks.user', 'users');
    if (filters) {
      Object.keys(filters).forEach((key) => {
        queryBuilder.andWhere(`tasks.${key} = :${key}`, {
          [key]: filters[key as keyof TaskEntity],
        });
      });
    }

    if (selectFields && selectFields.length > 0) {
      selectFields.forEach((field) => {
        queryBuilder.addSelect(`tasks.${String(field)}`);
      });
    }
    queryBuilder.addSelect(['users.username', 'users.role']);

    return queryBuilder.getMany();
  }

  async findById(taskId: number): Promise<TaskEntity | null> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'users')
      .where('task.taskId = :taskId', {
        taskId,
      })
      .getOne();

    return task;
  }

  async delete(taskId: number): Promise<void> {
    await this.taskRepository.delete(taskId);
  }
}
