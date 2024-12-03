import { Collection, ObjectId } from "mongodb";
import { PartModel, Vehicle, VehicleModel } from "./types.ts";
import { fromModelToVehicle } from "./utils.ts";

export const resolvers = {
  Query: {
    vehicles: async (
      _: unknown,
      __: unknown,
      context: { vehicleCollection: Collection<VehicleModel>;
        partsCollection: Collection<PartModel>;
       },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.vehicleCollection.find().toArray();
      return vehiclesModel.map((vehiclemodel) =>
        fromModelToVehicle(vehiclemodel,context.partsCollection)
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
      const broma = await fetch("https://official-joke-api.appspot.com/random_joke");
      const jsonData = await broma.json();
      const bromaentera = jsonData.setup+" " +jsonData.punchline;
      console.log(bromaentera, "\n");
      const { name, manufacturer, year} = args;
      
      const { insertedId } = await context.vehiclesCollection.insertOne({
        name,
        manufacturer,
        year,
        joke: bromaentera,
        parts: []
      });
      const vehicleModel = {
        _id: insertedId,
        name,
        manufacturer,
        year,
        joke: bromaentera,
        parts: [], 
      };
      return fromModelToVehicle(vehicleModel,context.partsCollection);
    },
    
  },
};