import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../../../features/user/dto/user-base.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
