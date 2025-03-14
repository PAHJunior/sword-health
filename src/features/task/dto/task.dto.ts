import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TaskBaseDto } from './task-base.dto';

export class TaskDto extends TaskBaseDto {
  @ApiProperty({
    description: 'Unique identifier for the task',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  public taskId: number;

  @ApiProperty({
    description:
      'UserId of the user. It should be a unique identifier for the user',
    example: 'paulo',
  })
  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @ApiProperty({
    description:
      'Username of the user. It should be a unique identifier for the user',
    example: 'paulo',
  })
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty({
    description: 'Timestamp when the task was created.',
    example: '2024-08-22T14:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of the last update to the task.',
    example: '2024-08-23T10:15:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
}
