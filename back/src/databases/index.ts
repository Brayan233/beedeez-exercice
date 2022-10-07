import { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE, REDIS_URL } from '@config';
import IORedis from 'ioredis';
import { Queue } from 'bullmq'

export const dbConnection = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}?authSource=admin`;



export const getRedisClient = () => {
  return new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
};

export const stationsQueue = new Queue('stations', { connection: getRedisClient() });

