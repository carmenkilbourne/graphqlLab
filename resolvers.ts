import { Collection, ObjectId } from "mongodb";
import { PartModel, Vehicle, VehicleModel } from "./types.ts";
import { fromModelToVehicle } from "./utils.ts";

export const resolvers = {
  Query: {
    vehicles: async (
      _: unknown,
      __: unknown,
      context: { vehicleCollection: Collection<VehicleModel>,
        partCollection: Collection<PartModel>
       },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.vehicleCollection.find().toArray();
      return vehiclesModel.map((vehiclemodel) =>
        fromModelToVehicle(vehiclemodel,partCollection)
      );
    },
  },
  Mutation: {
    addVehicle: async (
      _: unknown,
      args: { name: string; manufacturer: string; year: number },
      context: {
        vehiclesCollection: Collection<VehicleModel>;
        partsCollection: Collection<PartModel>; //HACER UN `ROMISE ALL
      },
    ): Promise<Vehicle> => {
      const { name, manufacturer, year} = args;
      const { insertedId } = await context.vehiclesCollection.insertOne({
        name,
        manufacturer,
        year,
        joke: "",
        parts: []
      });
      const vehicleModel = {
        _id: insertedId,
        name,
        manufacturer,
        year,
        joke: "",
        parts: [], 
      };
      return fromModelToVehicle(vehicleModel,context.partsCollection);
    },
  },
};