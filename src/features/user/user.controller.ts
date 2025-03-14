import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../../helpers/decorator/roles/roles.decorator';
import { UserRoleEnum } from './dto/user-base.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRoleEnum.MANAGER)
  findAll() {
    return this.userService.findAll();
  }
}
