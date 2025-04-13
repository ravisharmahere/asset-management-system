// location.service.ts
import { repositories } from '../repositories';
import {
  IBuildingCreate,
  IBuildingUpdate,
  IFloorCreate,
  IFloorUpdate,
  IRoomCreate,
  IRoomUpdate,
  ILocationHierarchy,
  IPaginationQuery,
} from '../interfaces';
import { NotFoundError } from '../utils/error';

export class LocationService {
  /* Building methods */
  async getAllBuildings(pagination?: IPaginationQuery) {
    return repositories.building.findAll({ pagination });
  }

  async getBuildingById(id: string) {
    return repositories.building.findById(id);
  }

  async getBuildingWithDetails(id: string) {
    return repositories.building.findBuildingWithDetails(id);
  }

  async createBuilding(data: IBuildingCreate) {
    return repositories.building.createBuilding(data);
  }

  async updateBuilding(id: string, data: IBuildingUpdate) {
    return repositories.building.updateBuilding(id, data);
  }

  async deleteBuilding(id: string) {
    return repositories.building.delete(id);
  }

  /* Floor methods */
  async getAllFloors(pagination?: IPaginationQuery) {
    return repositories.floor.findAll({
      relations: ['building'],
      pagination,
    });
  }

  async getFloorsByBuilding(buildingId: string, pagination?: IPaginationQuery) {
    return repositories.floor.findAll({
      where: { building_id: buildingId },
      relations: ['building'],
      pagination,
    });
  }

  async getFloorById(id: string) {
    return repositories.floor.findById(id, { relations: ['building'] });
  }

  async getFloorWithDetails(id: string) {
    return repositories.floor.findFloorWithDetails(id);
  }

  async createFloor(data: IFloorCreate) {
    return repositories.floor.createFloor(data);
  }

  async updateFloor(id: string, data: IFloorUpdate) {
    return repositories.floor.updateFloor(id, data);
  }

  async deleteFloor(id: string) {
    return repositories.floor.delete(id);
  }

  /* Room methods */
  async getAllRooms(pagination?: IPaginationQuery) {
    return repositories.room.findAll({
      relations: ['floor', 'floor.building'],
      pagination,
    });
  }

  async getRoomsByFloor(floorId: string, pagination?: IPaginationQuery) {
    return repositories.room.findAll({
      where: { floor_id: floorId },
      relations: ['floor', 'floor.building'],
      pagination,
    });
  }

  async getRoomById(id: string) {
    return repositories.room.findById(id, { relations: ['floor', 'floor.building'] });
  }

  async getRoomWithFullDetails(id: string): Promise<ILocationHierarchy> {
    return repositories.room.findRoomWithDetails(id);
  }

  async createRoom(data: IRoomCreate) {
    return repositories.room.createRoom(data);
  }

  async updateRoom(id: string, data: IRoomUpdate) {
    return repositories.room.updateRoom(id, data);
  }

  async deleteRoom(id: string) {
    return repositories.room.delete(id);
  }

  /* Location hierarchy methods */
  async getLocationHierarchy() {
    const buildings = await repositories.building.findAll({
      relations: ['floors', 'floors.rooms'],
    });

    return buildings.data;
  }

  async getLocationById(roomId: string): Promise<ILocationHierarchy> {
    // Find the room with its related floor and building
    return repositories.room.findRoomWithDetails(roomId);
  }
}

export const locationService = new LocationService();
