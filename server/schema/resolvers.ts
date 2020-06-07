import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

export const generalResolvers = {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
};
