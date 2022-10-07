import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set } from 'mongoose';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection, getRedisClient, stationsQueue } from '@databases';

import { Routes } from '@interfaces/routes.interface';
import { UpsertStation } from '@interfaces/jobs.interface';
import { StationStatus } from '@/interfaces/stationStatus.interface';
import { Station } from './interfaces/station.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';

import { Worker, WorkerOptions, Job } from 'bullmq';
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import axios from 'axios';
import stationService from '@services/stations.service';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public userService = new stationService();

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeBullDashboard();
    this.startJobs()
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`For the UI, open http://localhost:${this.port}/admin/queues`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    connect(dbConnection);
  }

  private async startJobs() {
    try {
      const connection = getRedisClient();
      const workerOptions: WorkerOptions = { connection };
      const worker = new Worker("stations", this.workerHandler, workerOptions);

      //Pull API every X second (30 actually)
      await stationsQueue.add('Pull stations from API velib', {}, {
        repeat: {
          every: 30000
        },
      });

    } catch (error) {
      console.log(error)
    }
  }

  private async workerHandler(job: Job<UpsertStation>) {

    try {
      console.log("Starting job:", job.name);
      switch (job.name) {
        case "Pull stations from API velib": {

          job.updateProgress(10);

          const res = await axios.get('https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json')
          const stations: Station[] = res.data.data.stations
          console.log(stations.length)

          const res2 = await axios.get('https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json')
          const statusArr: StationStatus[] = res2.data.data.stations
          console.log(stations.length)

          await Promise.all(stations.map(async (station: Station) => {
            station = { ...station, status: statusArr.find(status => status.station_id === station.station_id) }
            console.log(station)
            await stationsQueue.add('Check if new stations need insert/update/none', { "station": station })
          }));
          job.updateProgress(100);
          console.log("Finished job:", job.name);
          return;
        }
        case "Check if new stations need insert/update/none": {
          job.updateProgress(10);
          console.log('upsert')
          let station: Station = job.data.station
          await new stationService().upsertStation(station.station_id, station)
          job.updateProgress(100);
          console.log("Finished job:", job.name);
        }
          return;
      }
    } catch (error) {
      console.log(error)
    }
  };

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeBullDashboard() {

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [new BullMQAdapter(stationsQueue)],
      serverAdapter: serverAdapter,
    });

    this.app.use('/admin/queues', serverAdapter.getRouter());
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
