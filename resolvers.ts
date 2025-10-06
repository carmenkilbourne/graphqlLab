import { Collection, ObjectId } from "mongodb";
import { Part, PartModel, Vehicle, VehicleModel } from "./types.ts";
import { fromModelToPart, fromModelToVehicle } from "./utils.ts";

export const resolvers = {
  Query: {
    vehicles: async (
      _: unknown,
      __: unknown,
      context: {
        vehiclesCollection: Collection<VehicleModel>;
        partsCollection: Collection<PartModel>;
      },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.vehiclesCollection.find().toArray();
      return await Promise.all(
        vehiclesModel.map((vehiclemodel) =>
          fromModelToVehicle(vehiclemodel, context.partsCollection)
        ),
      );
    },
    vehicle: async (
      _: unknown,
      { id }: { id: string },
      context: {
        vehiclesCollection: Collection<VehicleModel>;
        partsCollection: Collection<PartModel>;
      },
    ): Promise<Vehicle| null> => {
      const vehiclesModel = await context.vehiclesCollection.findOne({
        _id: new ObjectId(id),
      });
      if(!vehiclesModel){
        console.log("no hay vehiculo con esa id");
        return null;
      }
      return fromModelToVehicle(vehiclesModel, context.partsCollection);
    },
    parts: async (
      _: unknown,
      __: unknown,
      context: {
        partsCollection: Collection<PartModel>;
      },
    ): Promise<Part[]> => {
      const partsModel = await context.partsCollection.find().toArray();
      return await Promise.all(
        partsModel.map((partmodel) =>
          fromModelToPart(partmodel)
        ),
      );
    },
    vehiclesByManufacturer: async (
      _: unknown,
      { manufacturer }: { manufacturer: string },
      context: {
        vehiclesCollection: Collection<VehicleModel>;
        partsCollection: Collection<PartModel>;
      },
    ): Promise<Vehicle[]|null> => {
      const vehiclesModel = await context.vehiclesCollection.find({
        manufacturer,
      }).toArray();
      if(!vehiclesModel){
        console.log("no hay vehiculo de ese manufacterer");
        return null;
      }
      return await Promise.all(
        vehiclesModel.map((vehiclemodel) =>
          fromModelToVehicle(vehiclemodel, context.partsCollection)
        ),
      );
    },
    vehiclesByYearRange: async (
      _: unknown,
      args:{ startYear: number;endYear:number},
      context: {
        vehiclesCollection: Collection<VehicleModel>;
        partsCollection: Collection<PartModel>;
      },
    ): Promise<Vehicle[]|null> => {
      const { startYear, endYear } = args;
      const vehiclesModel = await context.vehiclesCollection.find(
        {year:{ $gt: startYear, $lt: endYear}}

      ).toArray();
      if(!vehiclesModel){
        console.log("no hay vehiculo en este periodo de tiempo");
        return null;
      }
      return await Promise.all(
        vehiclesModel.map((vehiclemodel) =>
          fromModelToVehicle(vehiclemodel, context.partsCollection)
        ),
      );
    },
    
    partsByVehicle: async (
      _: unknown, 
      { vehicleId }: { vehicleId: string },
      context: {
        partsCollection: Collection<PartModel>;
      },
    ): Promise<Part[]|null> => {
      const partsModel = await context.partsCollection.find({
        vehicleId:new ObjectId(vehicleId),
      }).toArray();
      if(!partsModel){
        console.log("no hay vehiculo de ese manufacterer");
        return null;
      }
      return await Promise.all(
        partsModel.map((partModel) =>
          fromModelToPart(partModel)
        ),
      );
    },
  },

  Mutation: {
    addPart: async (
      _: unknown,
      args: { name: string; price: number; vehicleId: string },
      context: {
        partsCollection: Collection<PartModel>;
        vehiclesCollection: Collection<VehicleModel>;
      },
    ): Promise<Part> => {
      const { name, price, vehicleId } = args;
      const vehicle = await context.vehiclesCollection.findOne({
        _id: new ObjectId(vehicleId),
      });

      if (!vehicle) {
         console.log("no existe vehiculo al cual le puedo asignar la parte");
      }

      const { insertedId } = await context.partsCollection.insertOne({
        name,
        price,
        vehicleId: new ObjectId(vehicleId),
      });

      const partModel = {
        _id: insertedId,
        name,
        price,
        vehicleId: new ObjectId(vehicleId),
      };

      const { modifiedCount } = await context.vehiclesCollection.updateOne(
        { _id: new ObjectId(vehicleId) },
        { $push: { parts: insertedId } },
      );

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
        partsCollection: Collection<PartModel>; 
      },
    ): Promise<Vehicle> => {
      const broma = await fetch(
        "https://official-joke-api.appspot.com/random_joke",
      );
      const jsonData = await broma.json();
      const bromaentera = jsonData.setup + " " + jsonData.punchline;
      const { name, manufacturer, year } = args;

      const { insertedId } = await context.vehiclesCollection.insertOne({
        name,
        manufacturer,
        year,
        joke: bromaentera,
        parts: [],
      });
      const vehicleModel = {
        _id: insertedId,
        name,
        manufacturer,
        year,
        joke: bromaentera,
        parts: [],
      };
      return fromModelToVehicle(vehicleModel, context.partsCollection);
    },
    updateVehicle: async (
      _: unknown,
      args: { id: string; name: string; manufacturer: string; year: number },
      context: {
        vehiclesCollection: Collection<VehicleModel>;
      },
      //devuelvo ese objeto porque vehicle no cuadra con los valores que tiene que devolver la mutacion
    ): Promise<
      { id: string; name: string; manufacturer: string; year: number } | null
    > => {
      const id = args.id;
      const { name, manufacturer, year } = args;

      const vehiclemodificar = await context.vehiclesCollection.updateOne({
        _id: new ObjectId(id),
      }, { $set: { name, manufacturer, year } });

      if (!vehiclemodificar) {
        return null;
      }
      return { id: id, name: name, manufacturer: manufacturer, year: year };
    },
    //sin comprobar el funcionamiento
    deletePart: async (
      _: unknown,
      args: { id: string },
      context: {
        vehiclesCollection: Collection<VehicleModel>;
        partsCollection: Collection<PartModel>;
      },
    ): Promise<Part  | null> => {
      const id = args.id;
      const deletePartVehicle = await context.vehiclesCollection.updateOne(
        { parts: new ObjectId(id) }, 
       { $pull: { parts: new ObjectId(id) } } 
      );
      if (!deletePartVehicle) {
        console.log("No existe esta parte");
        return null;
      }
      //faltaria actualizar el array de parts de vehiculo quitardo el id de la pieza a eliminar
      const deletePart = await context.partsCollection.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!deletePart) {
        console.log("No existe esta parte");
        return null;
      }
      return fromModelToPart(deletePart);
    },
  },
};
