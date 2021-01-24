/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetMultiSsoTokenMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetMultiSsoTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'getMultiSSOToken'>
);


export const GetMultiSsoTokenDocument = gql`
    mutation GetMultiSSOToken($id: String!) {
  getMultiSSOToken(id: $id)
}
    `;
export type GetMultiSsoTokenMutationFn = Apollo.MutationFunction<GetMultiSsoTokenMutation, GetMultiSsoTokenMutationVariables>;

/**
 * __useGetMultiSsoTokenMutation__
 *
 * To run a mutation, you first call `useGetMultiSsoTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetMultiSsoTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getMultiSsoTokenMutation, { data, loading, error }] = useGetMultiSsoTokenMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMultiSsoTokenMutation(baseOptions?: Apollo.MutationHookOptions<GetMultiSsoTokenMutation, GetMultiSsoTokenMutationVariables>) {
        return Apollo.useMutation<GetMultiSsoTokenMutation, GetMultiSsoTokenMutationVariables>(GetMultiSsoTokenDocument, baseOptions);
      }
export type GetMultiSsoTokenMutationHookResult = ReturnType<typeof useGetMultiSsoTokenMutation>;
export type GetMultiSsoTokenMutationResult = Apollo.MutationResult<GetMultiSsoTokenMutation>;
export type GetMultiSsoTokenMutationOptions = Apollo.BaseMutationOptions<GetMultiSsoTokenMutation, GetMultiSsoTokenMutationVariables>;