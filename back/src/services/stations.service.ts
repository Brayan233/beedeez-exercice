import { hash } from 'bcrypt';
import { CreateStationDto } from '@dtos/stations.dto';
import { HttpException } from '@exceptions/HttpException';
import { Station } from '@/interfaces/station.interface';
import stationModel from '@/models/station.model';
import { isEmpty } from '@utils/util';

class StationService {
  public async findAllStation(): Promise<Station[]> {
    const query = { name: "Deli Llama" };
    const update = { $set: { name: "Deli Llama", address: "3 Nassau St" } };
    const options = { upsert: true };
    const stations: Station[] = await stationModel.find({}, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    return stations;
  }

  public async findStationByCode(code: string): Promise<Station> {
    if (isEmpty(code)) throw new HttpException(400, "Code is empty");

    const findStation: Station = await stationModel.findOne({ _code: code });
    if (!findStation) throw new HttpException(409, "Station doesn't exist");

    return findStation;
  }

  public async createStation(stationData: CreateStationDto): Promise<Station> {
    if (isEmpty(stationData)) throw new HttpException(400, "userData is empty");

    const findStation: Station = await stationModel.findOne({ station_id: stationData.station_id });
    if (findStation) throw new HttpException(409, `This station ${stationData.station_id} already exists`);

    const createStationData: Station = await stationModel.create(stationData);

    return createStationData;
  }

  public async upsertStation(station_id: number, stationData: CreateStationDto): Promise<Station> {

    const filter = { station_id };
    const newStation = stationData;

    if (isEmpty(stationData)) throw new HttpException(400, "stationData is empty");

    const findStation: Station = await stationModel.findOne(filter);
    if (!findStation) {
      console.log(`This station ${stationData.station_id} need to be created`);
      await stationModel.create(stationData);

    } else {
      console.log(`This station ${stationData.station_id} already exists so now we check if the station need to be updated`);

      const filter = { last_reported: findStation.status.last_reported, station_id: findStation.station_id };

      const findStation2: Station = await stationModel.findOne(filter);

      if (findStation2) {
        console.log('NO NEED UPSERT')
      } else {
        console.log('NEED UPSERT',)

        const filter = { station_id };
        const updateStationById: Station = await stationModel.findOneAndUpdate(filter, newStation);
        if (!updateStationById) throw new HttpException(409, "User doesn't exist");

        return updateStationById;
      }
    }

    return findStation;
  }

}

export default StationService;
