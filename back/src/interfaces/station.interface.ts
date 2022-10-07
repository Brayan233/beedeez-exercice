import { StationStatus } from "./stationStatus.interface"
export interface Station {
    station_id: number,
    name: string,
    lat: number,
    lon: number,
    capacity: number,
    stationCode: string
    status: StationStatus
}