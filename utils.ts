import type { Collection } from "mongodb";
import { Part, PartModel, Vehicle, VehicleModel } from "./types.ts";

export const fromModelToVehicle = async (
  vehicleDB: VehicleModel,
  partCollection: Collection<PartModel>
): Promise<Vehicle> => {
  const partss = await partCollection
    .find({ _id: { $in: vehicleDB.parts } })
    .toArray();
  return {
    id: vehicleDB._id!.toString(),
    name: vehicleDB.name,
    manufacturer: vehicleDB.manufacturer,
    year: vehicleDB.year,
    joke:vehicleDB.joke,
    parts:partss.map((p) => fromModelToPart(p)),
  };
};

export const fromModelToPart = (model: PartModel): Part => ({
  id: model._id!.toString(),
  name: model.name,
  price: model.price,
  vehicleId: model.vehicleId!.toString(),
});