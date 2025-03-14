import {
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from './task-base.dto';

export class TaskUpdateRequestDto {
  @ApiProperty({
    description: 'Summary of the task (optional)',
    example: 'Replaced broken equipment',
    required: false,
  })
  @IsOptional()
  @IsString()
  public summary?: string;

  @ApiProperty({
    description: 'Status of the task (optional)',
    enum: TaskStatusEnum,
    example: TaskStatusEnum.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatusEnum)
  public status?: TaskStatusEnum;

  @ApiProperty({
    description:
      'Date when the task was performed (required only if status is COMPLETED)',
    example: '2025-04-15T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((task) => task.status === TaskStatusEnum.COMPLETED)
  @IsDate()
  @IsNotEmpty({ message: 'performedAt is required when status is COMPLETED' })
  public performedAt?: Date;
}
