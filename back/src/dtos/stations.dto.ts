import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { StationStatus } from '@/interfaces/stationStatus.interface';
export class CreateStationDto {

    @IsNumber()
    public station_id: number;
    @IsString()
    public stationCode: string

    @IsString()
    public name: string;

    @IsNumber()
    public lat: number;

    @IsNumber()
    public lon: number;

    @IsNumber()
    public capacity: number;

    @IsObject()
    public status: object;
}
