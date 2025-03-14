import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDate,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TaskStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class TaskBaseDto {
  @ApiProperty({
    description:
      'Brief summary of the task (max: 2500 characters). May contain personal information.',
    example: 'Repaired the air conditioning unit in Room 302.',
    maxLength: 2500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2500)
  public summary: string;

  @ApiProperty({
    description: 'Date and time when the task was performed.',
    example: '2024-08-22T14:30:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  public performedAt?: Date;

  @ApiProperty({
    description: 'Current status of the task.',
    example: TaskStatusEnum.IN_PROGRESS,
    enum: TaskStatusEnum,
  })
  @IsEnum(TaskStatusEnum)
  public status: TaskStatusEnum;
}
