// location.interface.ts
export interface IBuilding {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  floors?: IFloor[];
}

export interface IBuildingCreate {
  name: string;
}

export interface IBuildingUpdate {
  name?: string;
}

export interface IFloor {
  id: string;
  name: string;
  building_id: string;
  building?: IBuilding;
  created_at: Date;
  updated_at: Date;
  rooms?: IRoom[];
}

export interface IFloorCreate {
  name: string;
  building_id: string;
}

export interface IFloorUpdate {
  name?: string;
  building_id?: string;
}

export interface IRoom {
  id: string;
  name: string;
  floor_id: string;
  floor?: IFloor;
  created_at: Date;
  updated_at: Date;
}

export interface IRoomCreate {
  name: string;
  floor_id: string;
}

export interface IRoomUpdate {
  name?: string;
  floor_id?: string;
}

export interface ILocationHierarchy {
  building: IBuilding;
  floor: IFloor;
  room: IRoom;
}

export interface ILocationPath {
  buildingName: string;
  floorName: string;
  roomName: string;
}
