import { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

export const AuthType = new GraphQLInputObjectType({
  name: 'authType',
  fields: () => {
    return {
      type: {
        type: new GraphQLNonNull(GraphQLString),
      },
      id: {
        type: GraphQLString,
      },
      host: {
        type: GraphQLString,
      },
      macaroon: {
        type: GraphQLString,
      },
      cert: {
        type: GraphQLString,
      },
    };
  },
});
