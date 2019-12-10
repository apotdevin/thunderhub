import { GraphQLObjectType, GraphQLInt } from 'graphql';

export const ChannelReportType = new GraphQLObjectType({
    name: 'channelReportType',
    fields: () => {
        return {
            local: {
                type: GraphQLInt,
            },
            remote: {
                type: GraphQLInt,
            },
            maxIn: {
                type: GraphQLInt,
            },
            maxOut: {
                type: GraphQLInt,
            },
        };
    },
});
