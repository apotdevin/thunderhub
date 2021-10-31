/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type PayMutationVariables = Types.Exact<{
  max_fee: Types.Scalars['Int'];
  max_paths: Types.Scalars['Int'];
  out?: Types.Maybe<Array<Types.Maybe<Types.Scalars['String']>> | Types.Maybe<Types.Scalars['String']>>;
  request: Types.Scalars['String'];
}>;


export type PayMutation = { __typename?: 'Mutation', pay?: boolean | null | undefined };


export const PayDocument = gql`
    mutation Pay($max_fee: Int!, $max_paths: Int!, $out: [String], $request: String!) {
  pay(max_fee: $max_fee, max_paths: $max_paths, out: $out, request: $request)
}
    `;
export type PayMutationFn = Apollo.MutationFunction<PayMutation, PayMutationVariables>;

/**
 * __usePayMutation__
 *
 * To run a mutation, you first call `usePayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payMutation, { data, loading, error }] = usePayMutation({
 *   variables: {
 *      max_fee: // value for 'max_fee'
 *      max_paths: // value for 'max_paths'
 *      out: // value for 'out'
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePayMutation(baseOptions?: Apollo.MutationHookOptions<PayMutation, PayMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PayMutation, PayMutationVariables>(PayDocument, options);
      }
export type PayMutationHookResult = ReturnType<typeof usePayMutation>;
export type PayMutationResult = Apollo.MutationResult<PayMutation>;
export type PayMutationOptions = Apollo.BaseMutationOptions<PayMutation, PayMutationVariables>;