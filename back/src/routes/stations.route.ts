import { Router } from 'express';
import StationsController from '@controllers/stations.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateStationDto } from '@/dtos/stations.dto';

class UsersRoute implements Routes {
  public path = '/stations';
  public router = Router();
  public stationController = new StationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.stationController.getStations);
    this.router.get(`${this.path}/:id`, this.stationController.getStationById);
     this.router.post(`${this.path}`, validationMiddleware(CreateStationDto, 'body'), this.stationController.createStation);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateStationDto, 'body', true), this.stationController.upsertStation);
    // this.router.delete(`${this.path}/:id`, this.stationController.deleteUser);
  }
}

export default UsersRoute;
