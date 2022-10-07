import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'stations', timestamps: true } })
class StationStatus {
  @prop({ required: true, unique: true })
  public stationCode: string;

  @prop()
  public station_id: number;

  @prop()
  public num_bikes_available: number;

  @prop()
  public numBikesAvailable: number;

  @prop({ type: () => [Object] })
  public num_bikes_available_types: Array<{ ebike: number, mechanical: number }>;

  @prop()
  public num_docks_available: number;

  @prop()
  public numDocksAvailable: number;

  @prop()
  public is_installed: number;

  @prop()
  public is_returning: number;

  @prop()
  public is_renting: number;

  @prop()
  public last_reported: number;
}

//const StationStatusModel = getModelForClass(StationStatus);

export default StationStatus;
