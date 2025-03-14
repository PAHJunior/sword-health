import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum UserRoleEnum {
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
}

export class UserBaseDto {
  @ApiProperty({
    description:
      'Username of the user. It should be a unique identifier for the user',
    example: 'paulo',
  })
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty({
    description:
      "Role of the user in the system. This determines the user's permissions and access rights",

    enum: UserRoleEnum,
  })
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  public role: UserRoleEnum;
}
