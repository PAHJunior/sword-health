import { IBaseRepository } from '../interfaces/base-repository.interface';

export function createMockRepository<T>(): IBaseRepository<T> {
  return {
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };
}
