import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskCreateRequestDto } from './dto/task-create.dto';
import { TaskDto } from './dto/task.dto';
import { GetUserIdToken } from '../../helpers/decorator/getUserId/getUserId.decorator';
import { GetUserRole } from '../../helpers/decorator/getUserRole/getUserRole.decorator';
import { UserRoleEnum } from '../user/dto/user-base.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskUpdateRequestDto } from './dto/task-update.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() body: TaskCreateRequestDto,
    @GetUserIdToken() userId: number,
    @GetUserRole() role: UserRoleEnum,
  ): Promise<TaskDto> {
    return this.taskService.create(body, userId, role);
  }

  @Get()
  findAll(
    @Query() filters: TaskFilterDto,
    @GetUserIdToken() userId: number,
    @GetUserRole() role: UserRoleEnum,
  ): Promise<TaskDto[]> {
    return this.taskService.findAll(filters, userId, role);
  }

  @Patch(':taskId')
  update(
    @Param('taskId') taskId: number,
    @Body() body: TaskUpdateRequestDto,
    @GetUserIdToken() userId: number,
    @GetUserRole() role: UserRoleEnum,
  ): Promise<TaskDto> {
    return this.taskService.update(taskId, body, userId, role);
  }

  @Delete(':taskId')
  async remove(
    @Param('taskId') taskId: number,
    @GetUserIdToken() userId: number,
    @GetUserRole() role: UserRoleEnum,
  ): Promise<void> {
    await this.taskService.remove(taskId, userId, role);
  }
}
