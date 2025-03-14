import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskEntity } from './repository/task.entity';
import { IBaseRepository } from '../../helpers/interfaces/base-repository.interface';
import { TaskCreateRequestDto } from './dto/task-create.dto';
import { TaskDto } from './dto/task.dto';
import { UserRoleEnum } from '../user/dto/user-base.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskUpdateRequestDto } from './dto/task-update.dto';

// TODO: Improve, add a filter to avoid code repetition for checking the user's role
@Injectable()
export class TaskService {
  public constructor(
    @Inject('TaskRepository')
    private taskRepository: IBaseRepository<TaskEntity>,
  ) {}

  public async create(
    payload: TaskCreateRequestDto,
    userId: number,
    role: UserRoleEnum,
  ): Promise<TaskDto> {
    if (role === UserRoleEnum.TECHNICIAN && payload.userId !== userId) {
      throw new ForbiddenException('You can only create tasks for yourself');
    }

    const task = await this.taskRepository.create({
      ...payload,
      userId,
    });

    return this.transformToDto(task);
  }

  public async findAll(
    filter: Partial<TaskFilterDto>,
    userId: number,
    role: UserRoleEnum,
  ): Promise<TaskDto[]> {
    if (role === UserRoleEnum.TECHNICIAN) {
      filter.userId = userId;
    }

    const tasks = await this.taskRepository.findAll(filter);

    return tasks.map((task) => this.transformToDto(task));
  }

  public async update(
    taskId: number,
    payload: TaskUpdateRequestDto,
    userId: number,
    role: UserRoleEnum,
  ): Promise<TaskDto> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (role === UserRoleEnum.TECHNICIAN && task.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to modify tasks that do not belong to you',
      );
    }

    await this.taskRepository.update(taskId, payload);
    const updateTask = await this.taskRepository.findById(taskId);

    if (!updateTask) {
      throw new NotFoundException('Task not found');
    }

    return this.transformToDto(updateTask);
  }

  public async remove(
    taskId: number,
    userId: number,
    role: UserRoleEnum,
  ): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (role === UserRoleEnum.TECHNICIAN && task.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete tasks that do not belong to you',
      );
    }

    await this.taskRepository.delete(taskId);
  }

  private transformToDto(task: TaskEntity): TaskDto {
    return {
      taskId: task.taskId,
      userId: task.user.userId,
      username: task.user.username,
      summary: task.summary,
      performedAt: task.performedAt,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
