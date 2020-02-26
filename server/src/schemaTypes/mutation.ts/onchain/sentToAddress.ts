import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
} from 'graphql';

export const SendToType = new GraphQLObjectType({
    name: 'sendToType',
    fields: () => {
        return {
            confirmationCount: { type: GraphQLString },
            id: { type: GraphQLString },
            isConfirmed: { type: GraphQLBoolean },
            isOutgoing: { type: GraphQLBoolean },
            tokens: { type: GraphQLInt },
        };
    },
});
