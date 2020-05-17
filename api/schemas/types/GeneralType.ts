import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export const AuthType = new GraphQLInputObjectType({
  name: 'authType',
  fields: () => {
    return {
      type: {
        type: GraphQLString,
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
