import { GraphQLObjectType, GraphQLString } from 'graphql';

export const InOutType = new GraphQLObjectType({
    name: 'InOutType',
    fields: () => {
        return {
            invoices: {
                type: GraphQLString,
            },
            payments: {
                type: GraphQLString,
            },
        };
    },
});
