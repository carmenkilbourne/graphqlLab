import { Collection, ObjectId } from "mongodb";
import { PartModel, Vehicle, VehicleModel,Part } from "./types.ts";
import { fromModelToPart, fromModelToVehicle } from "./utils.ts";

export const resolvers = {
  Query: {
    /* vehicles: async (
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
    }, */
  },
  Mutation: {
    addPart: async (
      _: unknown,
      args: { name: string; price: number;  vehicleId:string; },
      context: {
        partsCollection: Collection<PartModel>;
        vehicleCollection: Collection<VehicleModel>;
      },
    ): Promise<Part> => {
      const { name, price, vehicleId} = args;
      const objeto = new ObjectId(vehicleId);

      const { insertedId } = await context.partsCollection.insertOne({
        name,
        price,
        vehicleId,
      });
      const partModel = {
        _id: insertedId,
        name,
        price,
        vehicleId,
      };
      const { modifiedCount } =await context.vehicleCollection.updateOne(
        {_id: new ObjectId(vehicleId)},
        {$set:{name:"aidon"}});
        if (modifiedCount === 0) {
          console.log("no modificado");
                }

      return fromModelToPart(partModel);
    },
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