import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { query } from './query';
import { mutation } from './mutations';

export const thunderHubSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: query,
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutation,
  }),
});
