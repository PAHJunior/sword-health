import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBaseRepository } from 'src/helpers/interfaces/base-repository.interface';
import { UserEntity } from './user.entity';

@Injectable()
export class UserTypeOrmRepository implements IBaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  public async create(payload: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(payload);
  }

  public async update(userId: number, payload: UserEntity): Promise<void> {
    await this.usersRepository.update(userId, payload);
  }

  public findAll(
    filters?: Partial<UserEntity>,
    selectFields?: (keyof UserEntity)[],
  ): Promise<UserEntity[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('entity');

    if (filters) {
      Object.keys(filters).forEach((key) => {
        queryBuilder.andWhere(`entity.${key} = :${key}`, {
          [key]: filters[key as keyof UserEntity],
        });
      });
    }

    if (selectFields && selectFields.length > 0) {
      selectFields.forEach((field) => {
        queryBuilder.addSelect(`entity.${String(field)}`);
      });
    }

    return queryBuilder.getMany();
  }

  async findById(userId: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ userId });
  }

  async delete(userId: number): Promise<void> {
    await this.usersRepository.delete(userId);
  }
}
