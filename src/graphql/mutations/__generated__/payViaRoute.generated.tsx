/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type PayViaRouteMutationVariables = Types.Exact<{
  route: Types.Scalars['String'];
  id: Types.Scalars['String'];
}>;


export type PayViaRouteMutation = { __typename?: 'Mutation', payViaRoute?: Types.Maybe<boolean> };


export const PayViaRouteDocument = gql`
    mutation PayViaRoute($route: String!, $id: String!) {
  payViaRoute(route: $route, id: $id)
}
    `;
export type PayViaRouteMutationFn = Apollo.MutationFunction<PayViaRouteMutation, PayViaRouteMutationVariables>;

/**
 * __usePayViaRouteMutation__
 *
 * To run a mutation, you first call `usePayViaRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayViaRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payViaRouteMutation, { data, loading, error }] = usePayViaRouteMutation({
 *   variables: {
 *      route: // value for 'route'
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePayViaRouteMutation(baseOptions?: Apollo.MutationHookOptions<PayViaRouteMutation, PayViaRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PayViaRouteMutation, PayViaRouteMutationVariables>(PayViaRouteDocument, options);
      }
export type PayViaRouteMutationHookResult = ReturnType<typeof usePayViaRouteMutation>;
export type PayViaRouteMutationResult = Apollo.MutationResult<PayViaRouteMutation>;
export type PayViaRouteMutationOptions = Apollo.BaseMutationOptions<PayViaRouteMutation, PayViaRouteMutationVariables>;