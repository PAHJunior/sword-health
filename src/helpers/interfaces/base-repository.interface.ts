export interface IBaseRepository<T, R = T> {
  findById(id: number): Promise<R | null>;
  create(data: Partial<T>): Promise<R>;
  update(id: number, data: Partial<T>): Promise<void>;
  findAll(filters?: Partial<T>, selectFields?: (keyof T)[]): Promise<R[]>;
  delete(userId: number): Promise<void>;
}
