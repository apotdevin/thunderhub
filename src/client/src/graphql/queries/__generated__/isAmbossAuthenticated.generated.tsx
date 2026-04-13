import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type IsAmbossAuthenticatedQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type IsAmbossAuthenticatedQuery = {
  __typename?: 'Query';
  isAmbossAuthenticated: boolean;
};

export const IsAmbossAuthenticatedDocument = gql`
  query IsAmbossAuthenticated {
    isAmbossAuthenticated
  }
`;

export function useIsAmbossAuthenticatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    IsAmbossAuthenticatedQuery,
    IsAmbossAuthenticatedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    IsAmbossAuthenticatedQuery,
    IsAmbossAuthenticatedQueryVariables
  >(IsAmbossAuthenticatedDocument, options);
}
export function useIsAmbossAuthenticatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    IsAmbossAuthenticatedQuery,
    IsAmbossAuthenticatedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    IsAmbossAuthenticatedQuery,
    IsAmbossAuthenticatedQueryVariables
  >(IsAmbossAuthenticatedDocument, options);
}
export type IsAmbossAuthenticatedQueryHookResult = ReturnType<
  typeof useIsAmbossAuthenticatedQuery
>;
export type IsAmbossAuthenticatedLazyQueryHookResult = ReturnType<
  typeof useIsAmbossAuthenticatedLazyQuery
>;
export type IsAmbossAuthenticatedQueryResult = Apollo.QueryResult<
  IsAmbossAuthenticatedQuery,
  IsAmbossAuthenticatedQueryVariables
>;
