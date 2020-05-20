// Based on https://github.com/stems/graphql-bigint/

import { Kind, GraphQLScalarType } from 'graphql';

export const BigInt = new GraphQLScalarType({
  name: 'BigInt',
  description:
    'The `BigInt` scalar type represents non-fractional signed whole numeric values.',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (
      ast.kind === Kind.INT ||
      ast.kind === Kind.FLOAT ||
      ast.kind === Kind.STRING
    ) {
      return BigInt(ast.value);
    }
    return null;
  },
});
