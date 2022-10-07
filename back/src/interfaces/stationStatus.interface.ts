export interface StationStatus {
    stationCode: string,
    station_id: number,
    num_bikes_available: number,
    numBikesAvailable: number,
    num_bikes_available_types: Array<{ ebike: number, mechanical: number }>,
    num_docks_available: number,
    numDocksAvailable: number,
    is_installed: number,
    is_returning: number,
    is_renting: number,
    last_reported: number
}