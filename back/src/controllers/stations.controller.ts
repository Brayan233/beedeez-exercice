import { NextFunction, Request, Response } from 'express';
import { Station } from '@/interfaces/station.interface';
import stationService from '@services/stations.service';

class StationsController {
  public stationService = new stationService();

  public getStations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('OKOK')
      const findAllStationsData: Station[] = await this.stationService.findAllStation();

      res.status(200).json(findAllStationsData);
    } catch (error) {
      next(error);
    }
  };

  public getStationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stationId: string = req.params.id;
      const findOneUserData: Station = await this.stationService.findStationByCode(stationId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createStation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stationData: any = req.body;
      const createStationData: Station = await this.stationService.createStation(stationData);

      res.status(201).json({ data: createStationData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public upsertStation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stationData: any = req.body;
      const stationId: number = parseInt(req.params.id);
      const updateStationData: Station = await this.stationService.upsertStation(stationId, stationData);

      res.status(200).json({ data: updateStationData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

}

export default StationsController;
