import { Router } from 'express';
import { LocationController } from '../controllers';

export class LocationRoutes {
  readonly router = Router();
  readonly controller = new LocationController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/buildings', this.controller.getAllBuildings);

    this.router.get('/buildings/:id', this.controller.getBuildingById);

    this.router.get('/buildings/:id/details', this.controller.getBuildingWithDetails);

    this.router.post('/buildings', this.controller.createBuilding);

    this.router.put('/buildings/:id', this.controller.updateBuilding);

    this.router.delete('/buildings/:id', this.controller.deleteBuilding);

    /**
     * Floor routes
     */

    this.router.get('/floors', this.controller.getAllFloors);

    this.router.get('/buildings/:buildingId/floors', this.controller.getFloorsByBuilding);

    this.router.get('/floors/:id', this.controller.getFloorById);

    this.router.get('/floors/:id/details', this.controller.getFloorWithDetails);

    this.router.post('/floors', this.controller.createFloor);

    this.router.put('/floors/:id', this.controller.updateFloor);

    this.router.delete('/floors/:id', this.controller.deleteFloor);

    /**
     * Room routes
     */

    this.router.get('/rooms', this.controller.getAllRooms);

    this.router.get('/floors/:floorId/rooms', this.controller.getRoomsByFloor);

    this.router.get('/rooms/:id', this.controller.getRoomById);

    this.router.get('/rooms/:id/details', this.controller.getRoomWithFullDetails);

    this.router.post('/rooms', this.controller.createRoom);

    this.router.put('/rooms/:id', this.controller.updateRoom);

    this.router.delete('/rooms/:id', this.controller.deleteRoom);

    /**
     * Hierarchy routes
     */

    this.router.get('/hierarchy', this.controller.getLocationHierarchy);

    this.router.get('/rooms/:roomId/location', this.controller.getLocationByRoomId);
  }
}
