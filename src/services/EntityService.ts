export interface IEntity<T> {
  get(id: string): Promise<T>;
  getMany(ids: string): Promise<T[]>;
}
