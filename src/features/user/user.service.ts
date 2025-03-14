import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { IBaseRepository } from 'src/helpers/interfaces/base-repository.interface';
import { UserEntity } from './repository/user.entity';

@Injectable()
export class UserService {
  public constructor(
    @Inject('UserRepository')
    private userRepository: IBaseRepository<UserEntity>,
  ) {}

  public async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => this.transformToDto(user));
  }

  private transformToDto(user: UserEntity): UserDto {
    return {
      userId: user.userId,
      username: user.username,
      role: user.role,
    };
  }
}
