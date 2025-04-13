// location.repository.ts
import { BaseRepository } from './base.repository';
import { Building } from '../models/building.entity';
import { Floor } from '../models/floor.entity';
import { Room } from '../models/room.entity';
import {
  IBuilding,
  IBuildingCreate,
  IBuildingUpdate,
  IFloor,
  IFloorCreate,
  IFloorUpdate,
  IRoom,
  IRoomCreate,
  IRoomUpdate,
  ILocationHierarchy,
} from '../interfaces';
import { ConflictError, NotFoundError } from '../utils/error';
import { FindOptionsWhere } from 'typeorm';

export class BuildingRepository extends BaseRepository<Building> {
  constructor() {
    super(Building);
  }

  async findByName(name: string): Promise<Building | null> {
    return this.repository.findOne({
      where: { name } as FindOptionsWhere<Building>,
    });
  }

  async findBuildingWithDetails(id: string): Promise<Building> {
    return this.findById(id, { relations: ['floors', 'floors.rooms'] });
  }

  async createBuilding(data: IBuildingCreate): Promise<Building> {
    // Check if building with name already exists
    const existing = await this.findByName(data.name);
    if (existing) {
      throw new ConflictError(`Building with name '${data.name}' already exists`);
    }

    return this.create(data);
  }

  async updateBuilding(id: string, data: IBuildingUpdate): Promise<Building> {
    // Check if name is being changed and already exists
    if (data.name) {
      const existing = await this.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Building with name '${data.name}' already exists`);
      }
    }

    return this.update(id, data);
  }
}

export class FloorRepository extends BaseRepository<Floor> {
  constructor() {
    super(Floor);
  }

  async findByNameAndBuilding(name: string, buildingId: string): Promise<Floor | null> {
    return this.repository.findOne({
      where: {
        name,
        building_id: buildingId,
      } as FindOptionsWhere<Floor>,
    });
  }

  async findFloorWithDetails(id: string): Promise<Floor> {
    return this.findById(id, { relations: ['building', 'rooms'] });
  }

  async createFloor(data: IFloorCreate): Promise<Floor> {
    // Check if floor with name already exists in the building
    const existing = await this.findByNameAndBuilding(data.name, data.building_id);
    if (existing) {
      throw new ConflictError(`Floor '${data.name}' already exists in this building`);
    }

    // Verify building exists
    const buildingRepository = new BuildingRepository();
    await buildingRepository.findById(data.building_id);

    return this.create(data);
  }

  async updateFloor(id: string, data: IFloorUpdate): Promise<Floor> {
    const floor = await this.findById(id);

    // If building_id is changed, verify new building exists
    if (data.building_id && data.building_id !== floor.building_id) {
      const buildingRepository = new BuildingRepository();
      await buildingRepository.findById(data.building_id);
    }

    // Check if name is being changed and already exists in the building
    if (data.name && (data.name !== floor.name || data.building_id)) {
      const buildingId = data.building_id || floor.building_id;
      const existing = await this.findByNameAndBuilding(data.name, buildingId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Floor '${data.name}' already exists in this building`);
      }
    }

    return this.update(id, data);
  }
}

export class RoomRepository extends BaseRepository<Room> {
  constructor() {
    super(Room);
  }

  async findByNameAndFloor(name: string, floorId: string): Promise<Room | null> {
    return this.repository.findOne({
      where: {
        name,
        floor_id: floorId,
      } as FindOptionsWhere<Room>,
    });
  }

  async findRoomWithDetails(id: string): Promise<ILocationHierarchy> {
    const room = await this.findById(id, { relations: ['floor', 'floor.building'] });

    if (!room || !room.floor || !room.floor.building) {
      throw new NotFoundError(`Complete room hierarchy not found for room ID ${id}`);
    }

    return {
      building: room.floor.building,
      floor: room.floor,
      room,
    };
  }

  async createRoom(data: IRoomCreate): Promise<Room> {
    // Check if room with name already exists on the floor
    const existing = await this.findByNameAndFloor(data.name, data.floor_id);
    if (existing) {
      throw new ConflictError(`Room '${data.name}' already exists on this floor`);
    }

    // Verify floor exists
    const floorRepository = new FloorRepository();
    await floorRepository.findById(data.floor_id);

    return this.create(data);
  }

  async updateRoom(id: string, data: IRoomUpdate): Promise<Room> {
    const room = await this.findById(id);

    // If floor_id is changed, verify new floor exists
    if (data.floor_id && data.floor_id !== room.floor_id) {
      const floorRepository = new FloorRepository();
      await floorRepository.findById(data.floor_id);
    }

    // Check if name is being changed and already exists on the floor
    if (data.name && (data.name !== room.name || data.floor_id)) {
      const floorId = data.floor_id || room.floor_id;
      const existing = await this.findByNameAndFloor(data.name, floorId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Room '${data.name}' already exists on this floor`);
      }
    }

    return this.update(id, data);
  }
}
