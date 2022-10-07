import { Station } from '@interfaces/station.interface';

export interface UpsertStation {
  type: string;
  station: Station;
};
export interface StartInsertOrUpdateStationsJob {
  type: string;
  data: { hello: string };
};


export type WorkerJob =
  | UpsertStation
  | StartInsertOrUpdateStationsJob