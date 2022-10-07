import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import StationStatus from '@models/stationStatus.model'
@modelOptions({ schemaOptions: { collection: 'stations', timestamps: false } })

class Station {
  @prop({ required: true, unique: true })
  public stationCode: string;

  @prop()
  public station_id: number;

  @prop()
  public name: string;

  @prop()
  public lat: number;

  @prop()
  public lon: number;

  @prop()
  public capacity: number;

  @prop()
  public rental_methods: Array<String>;

  @prop()
  public status: StationStatus;
}

const StationModel = getModelForClass(Station);

export default StationModel;
