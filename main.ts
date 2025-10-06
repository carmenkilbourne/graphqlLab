import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";
import { PartModel, VehicleModel } from "./types.ts";

// Carga variables de entorno (crea .env con MONGO_URL=tu-url)
const MONGO_URL = Deno.env.get("MONGO_URL") || "mongodb+srv://default@cluster..."; // Fallback para dev

async function main() {
  let client: MongoClient | null = null;
  try {
    console.log("Conectando a MongoDB...");
    client = new MongoClient(MONGO_URL);
    await client.connect();

    const db = client.db("practica4");
    const vehiclesCollection = db.collection<VehicleModel>("vehiculos");
    const partsCollection = db.collection<PartModel>("parts");

    // Prueba conexión básica
    await vehiclesCollection.findOne({}); // O cualquier query simple
    console.log("✅ Conexión DB exitosa");

    const server = new ApolloServer({
      typeDefs: schema,
      resolvers,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 }, // Puerto configurable
      context: async () => ({ 
        vehiclesCollection, 
        partsCollection,
        mongoClient: client! // Pasa el client para resolvers si necesitan
      }),
    });

    console.info(`🚀 Server escuchando en ${url}`);
  } catch (error) {
    console.error("❌ Error en startup:", error);
    if (client) await client.close();
    Deno.exit(1); // Exit graceful
  }
}

main();