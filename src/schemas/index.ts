import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { query } from "./query";

export const thunderHubSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: query
  })
});
