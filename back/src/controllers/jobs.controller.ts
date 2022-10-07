import { NextFunction, Request, Response } from 'express';
import { WorkerJob } from '@interfaces/jobs.interface';
import stationService from '@services/stations.service';
import { Queue } from "bullmq";
import { Job, Worker, WorkerOptions } from "bullmq";

import { StartInsertOrUpdateStationsJob } from '@interfaces/jobs.interface';
import { dbConnection, getRedisClient } from '@databases';


const addJobToQueue = (job: StartInsertOrUpdateStationsJob, queue: Queue) => queue.add(job.type, job);
const connection = getRedisClient();

const workerOptions: WorkerOptions = { connection };

const workerHandler = async (job: Job<WorkerJob>) => {
    switch (job.data.type) {
        case "PrintHelloWorld": {
            console.log(`Hello world!`, job.data);
            return;
        }
        case "DoSomeHeavyComputing": {
            console.log("Starting job:", job.name);
            job.updateProgress(10);

            job.updateProgress(100);
            console.log("Finished job:", job.name);
            return;
        }
        case "MayFailOrNot": {
            if (Math.random() > 0.3) {
                throw new Error("Something went wrong");
            }
            return "Done!";
        }
    }
};

class JobsController {
    public stationService = new stationService();



    public callJobs = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const queueName: string = req.params.queueName;
            const queue = new Queue(queueName, { connection });
            const worker = new Worker(queueName, workerHandler, workerOptions);
            console.log(`Worker started on queue for job `);

            await addJobToQueue({
                type: "PrintHelloWorld",
                data: { hello: 'string' }
            }, queue);

            console.log('OKOK');

        } catch (error) {
            next(error);
        }
    };
}

export default JobsController;
