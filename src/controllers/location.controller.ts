// location.controller.ts
import { Request, Response } from 'express';
import { services } from '../services';
import { asyncHandler } from '../utils/error';
import { IPaginationQuery } from '../interfaces';
import { BadRequestError, SuccessResponse, SuccessMsgResponse } from './../core';

export class LocationController {
  /* Building endpoints */

  getAllBuildings = asyncHandler(async (req: Request, res: Response) => {
    const pagination: IPaginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: (req.query.sort as string) || 'name',
      order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
    };

    const buildings = await services.location.getAllBuildings(pagination);
    return new SuccessResponse('Buildings retrieved successfully', buildings).send(res);
  });

  getBuildingById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const building = await services.location.getBuildingById(id);
    return new SuccessResponse('Building retrieved successfully', building).send(res);
  });

  getBuildingWithDetails = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const building = await services.location.getBuildingWithDetails(id);
    return new SuccessResponse('Building details retrieved successfully', building).send(res);
  });

  createBuilding = asyncHandler(async (req: Request, res: Response) => {
    const buildingData = req.body;
    const building = await services.location.createBuilding(buildingData);
    return new SuccessResponse('Building created successfully', building).send(res);
  });

  updateBuilding = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const buildingData = req.body;
    const building = await services.location.updateBuilding(id, buildingData);
    return new SuccessResponse('Building updated successfully', building).send(res);
  });

  deleteBuilding = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await services.location.deleteBuilding(id);
    return new SuccessMsgResponse('Building deleted successfully').send(res);
  });

  /* Floor endpoints */

  getAllFloors = asyncHandler(async (req: Request, res: Response) => {
    const pagination: IPaginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: (req.query.sort as string) || 'name',
      order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
    };

    const floors = await services.location.getAllFloors(pagination);
    return new SuccessResponse('Floors retrieved successfully', floors).send(res);
  });

  getFloorsByBuilding = asyncHandler(async (req: Request, res: Response) => {
    const buildingId = req.params.buildingId;
    if (!buildingId) throw new BadRequestError('Building ID is required');

    const pagination: IPaginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: (req.query.sort as string) || 'name',
      order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
    };

    const floors = await services.location.getFloorsByBuilding(buildingId, pagination);
    return new SuccessResponse('Floors retrieved successfully', floors).send(res);
  });

  getFloorById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const floor = await services.location.getFloorById(id);
    return new SuccessResponse('Floor retrieved successfully', floor).send(res);
  });

  getFloorWithDetails = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const floor = await services.location.getFloorWithDetails(id);
    return new SuccessResponse('Floor details retrieved successfully', floor).send(res);
  });

  createFloor = asyncHandler(async (req: Request, res: Response) => {
    const floorData = req.body;
    const floor = await services.location.createFloor(floorData);
    return new SuccessResponse('Floor created successfully', floor).send(res);
  });

  updateFloor = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const floorData = req.body;
    const floor = await services.location.updateFloor(id, floorData);
    return new SuccessResponse('Floor updated successfully', floor).send(res);
  });

  deleteFloor = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await services.location.deleteFloor(id);
    return new SuccessMsgResponse('Floor deleted successfully').send(res);
  });

  /* Room endpoints */

  getAllRooms = asyncHandler(async (req: Request, res: Response) => {
    const pagination: IPaginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: (req.query.sort as string) || 'name',
      order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
    };

    const rooms = await services.location.getAllRooms(pagination);
    return new SuccessResponse('Rooms retrieved successfully', rooms).send(res);
  });

  getRoomsByFloor = asyncHandler(async (req: Request, res: Response) => {
    const floorId = req.params.floorId;
    if (!floorId) throw new BadRequestError('Floor ID is required');

    const pagination: IPaginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: (req.query.sort as string) || 'name',
      order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
    };

    const rooms = await services.location.getRoomsByFloor(floorId, pagination);
    return new SuccessResponse('Rooms retrieved successfully', rooms).send(res);
  });

  getRoomById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const room = await services.location.getRoomById(id);
    return new SuccessResponse('Room retrieved successfully', room).send(res);
  });

  getRoomWithFullDetails = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const roomDetails = await services.location.getRoomWithFullDetails(id);
    return new SuccessResponse('Room details retrieved successfully', roomDetails).send(res);
  });

  createRoom = asyncHandler(async (req: Request, res: Response) => {
    const roomData = req.body;
    const room = await services.location.createRoom(roomData);
    return new SuccessResponse('Room created successfully', room).send(res);
  });

  updateRoom = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const roomData = req.body;
    const room = await services.location.updateRoom(id, roomData);
    return new SuccessResponse('Room updated successfully', room).send(res);
  });

  deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await services.location.deleteRoom(id);
    return new SuccessMsgResponse('Room deleted successfully').send(res);
  });

  /* Location hierarchy endpoints */

  getLocationHierarchy = asyncHandler(async (req: Request, res: Response) => {
    const hierarchy = await services.location.getLocationHierarchy();
    return new SuccessResponse('Location hierarchy retrieved successfully', hierarchy).send(res);
  });

  getLocationByRoomId = asyncHandler(async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    if (!roomId) throw new BadRequestError('Room ID is required');

    const location = await services.location.getLocationById(roomId);
    return new SuccessResponse('Location retrieved successfully', location).send(res);
  });
}
