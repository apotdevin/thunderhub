import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

export const InOutType = new GraphQLObjectType({
    name: 'InOutType',
    fields: () => {
        return {
            invoices: { type: GraphQLString },
            payments: { type: GraphQLString },
            confirmedInvoices: { type: GraphQLInt },
            unConfirmedInvoices: { type: GraphQLInt },
        };
    },
});
