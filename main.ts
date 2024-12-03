import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";
import { PartModel, VehicleModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
const broma = await fetch("https://official-joke-api.appspot.com/random_joke");
const jsonData = await broma.json();

console.log(jsonData.setup, "\n")

if (!MONGO_URL) {
  throw new Error("MONGO_URL no encontrada");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();


const client = new MongoClient(MONGO_URL);
const db = client.db("practica4");
const vehiclesCollection = db.collection<VehicleModel>("vehiculos");
const partsCollection = db.collection<PartModel>("parts");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ vehiclesCollection,partsCollection}),
});

console.info(`Server escuchando en ${url}`);
