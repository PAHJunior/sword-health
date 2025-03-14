import { UserRoleEnum } from '../../features/user/dto/user-base.dto';

export class JwtPayloadDto {
  public username: string;
  public role: UserRoleEnum;
  public sub: number;
}
