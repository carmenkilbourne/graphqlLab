export const schema = `#graphql
type Vehicle {
  id: ID!
  name: String!
  manufacturer: String!
  year:Int!
  joke:String
  parts:[Part]
}
type Part {
  id: ID!
  name: String!
  price:Int!
  vehicleId:String!
}

type Query {
  vehicles: [Vehicle!]!
  vehicle(id: ID!): Vehicle
  parts:[Part!]!
  vehiclesByManufacturer(manufacturer:String!):[Vehicle]!
  partsByVehicle(id: ID!):Part

}

type Mutation {
    addVehicle(name: String!, manufacturer: String!,year:Int!): Vehicle!
    addPart(name: String!,price:Int!,  vehicleId:String!):Part!
    updateVehicle(id: ID!,name: String!,manufacturer: String!,year:Int!):Vehicle!
    deletePart(id: ID!): Vehicle
}
`;