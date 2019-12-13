import { GraphQLObjectType, GraphQLString } from 'graphql';

export const GetResumeType = new GraphQLObjectType({
    name: 'getResumeType',
    fields: () => ({
        token: { type: GraphQLString },
        resume: { type: GraphQLString },
    }),
});
