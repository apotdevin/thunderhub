/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type BosPayMutationVariables = Types.Exact<{
  max_fee: Types.Scalars['Int'];
  max_paths: Types.Scalars['Int'];
  message?: Types.Maybe<Types.Scalars['String']>;
  out?: Types.Maybe<Array<Types.Maybe<Types.Scalars['String']>>>;
  request: Types.Scalars['String'];
}>;


export type BosPayMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'bosPay'>
);


export const BosPayDocument = gql`
    mutation BosPay($max_fee: Int!, $max_paths: Int!, $message: String, $out: [String], $request: String!) {
  bosPay(
    max_fee: $max_fee
    max_paths: $max_paths
    message: $message
    out: $out
    request: $request
  )
}
    `;
export type BosPayMutationFn = Apollo.MutationFunction<BosPayMutation, BosPayMutationVariables>;

/**
 * __useBosPayMutation__
 *
 * To run a mutation, you first call `useBosPayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBosPayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bosPayMutation, { data, loading, error }] = useBosPayMutation({
 *   variables: {
 *      max_fee: // value for 'max_fee'
 *      max_paths: // value for 'max_paths'
 *      message: // value for 'message'
 *      out: // value for 'out'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useBosPayMutation(baseOptions?: Apollo.MutationHookOptions<BosPayMutation, BosPayMutationVariables>) {
        return Apollo.useMutation<BosPayMutation, BosPayMutationVariables>(BosPayDocument, baseOptions);
      }
export type BosPayMutationHookResult = ReturnType<typeof useBosPayMutation>;
export type BosPayMutationResult = Apollo.MutationResult<BosPayMutation>;
export type BosPayMutationOptions = Apollo.BaseMutationOptions<BosPayMutation, BosPayMutationVariables>;