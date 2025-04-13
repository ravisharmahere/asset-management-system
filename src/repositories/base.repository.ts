// base.repository.ts
import {
  Repository,
  EntityTarget,
  FindOptionsWhere,
  DeepPartial,
  FindOneOptions,
  FindOptionsOrder,
  ObjectLiteral,
} from 'typeorm';
import { MySQLDatabase } from './../database';
import { generateUUID, getPaginationOptions } from '../utils/helpers';
import { IPaginationQuery, IPaginatedResponse } from '../interfaces/common.interface';
import { NotFoundError } from '../utils/error';

export class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;
  protected entityName: string;

  constructor(entity: EntityTarget<T>) {
    this.repository = MySQLDatabase.getInstance().getDataSource().getRepository(entity);
    // Get the entity name for error messages
    this.entityName = entity.toString().split(' ')[1] || 'Entity';
  }

  async findAll(options?: {
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    relations?: string[];
    pagination?: IPaginationQuery;
    order?: FindOptionsOrder<T>;
  }): Promise<IPaginatedResponse<T>> {
    const { page, limit, sort, order } = getPaginationOptions(options?.pagination || {});

    const [data, total] = await this.repository.findAndCount({
      where: options?.where,
      relations: options?.relations,
      order: options?.order || ({ [sort]: order } as FindOptionsOrder<T>),
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, options?: { relations?: string[] }): Promise<T> {
    const findOptions: FindOneOptions<T> = {
      where: { id } as unknown as FindOptionsWhere<T>,
      relations: options?.relations,
    };

    const entity = await this.repository.findOne(findOptions);

    if (!entity) {
      throw new NotFoundError(`${this.entityName} with id ${id} not found`);
    }

    return entity;
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async create(data: DeepPartial<T>, generateId: boolean = true): Promise<T> {
    // Generate UUID if needed
    const entityData = generateId ? { ...data, id: generateUUID() } : data;

    const entity = this.repository.create(entityData as DeepPartial<T>);
    return this.repository.save(entity as T);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    // First check if entity exists
    await this.findById(id);

    // Update entity
    await this.repository.update(id, data as any);

    // Return updated entity
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.remove(entity);
  }

  async count(where?: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<number> {
    return this.repository.count({ where });
  }
}
