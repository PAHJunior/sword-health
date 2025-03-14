import { ApiProperty } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto extends UserBaseDto {
  @ApiProperty({
    description:
      "Password of the user. It should be a secure, encrypted string to ensure the user's account security.",
    example: 'StrongP@ssw0rd123!@#',
  })
  @IsString()
  @IsNotEmpty()
  public password: string;
}
