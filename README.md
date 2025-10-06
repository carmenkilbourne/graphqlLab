# graphqlLab 🚀

![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white) ![Deno](https://img.shields.io/badge/Deno-5405A1?style=for-the-badge&logo=deno&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Un servidor GraphQL backend en Deno/TypeScript para gestionar vehículos y partes de autos, con mutations asíncronas, integración de APIs externas (e.g., fetch de chistes aleatorios) y conexión a MongoDB Atlas. Ideal para aprender resolvers, contextos y escalabilidad en entornos modernos.

## ✨ Características
- **GraphQL Schema Completo**: Queries (listar vehículos/partes), Mutations (añadir vehículo con joke API).
- **Backend Async**: Usa `Promise.all` para paralelizar inserts DB + fetch externo.
- **DB Integrada**: MongoDB para collections "vehiculos" y "parts" (con validación y error handling).
- **Seguro y Moderno**: Variables de entorno para creds, try-catch en resolvers, Deno para ejecución segura.
- **Extensible**: Fácil añadir IA (e.g., recomendaciones de partes con cosine similarity de mi proyecto ML).

## 🛠️ Tech Stack
- **Framework**: Apollo Server v4 (GraphQL)
- **Runtime**: Deno (seguro, sin node_modules)
- **DB**: MongoDB Atlas (NoSQL)
- **Lenguaje**: TypeScript (tipado fuerte)
- **Otras**: Fetch API (nativo), Zod para validación (opcional)

## 📋 Requisitos
- Deno 1.40+ (`deno --version`)
- MongoDB Atlas (cuenta gratuita) o local
- Editor: VS Code con Deno extension

## 🚀 Setup Rápido
1. **Clona el Repo**:

2. **Configura .env** (no commitees—añade a .gitignore):

3. **Instala Dependencias** (Deno maneja imports dinámicos—no npm):

      "@apollo/server": "https://deno.land/x/apollo_server@4.10.5/mod.ts"
      {
  "name": "Toyota Prius",
  "manufacturer": "Toyota",
  "year": 2023
}A
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)