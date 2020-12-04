/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetSessionTokenMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type GetSessionTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'getSessionToken'>
);


export const GetSessionTokenDocument = gql`
    mutation GetSessionToken($id: String!, $password: String!) {
  getSessionToken(id: $id, password: $password)
}
    `;
export type GetSessionTokenMutationFn = Apollo.MutationFunction<GetSessionTokenMutation, GetSessionTokenMutationVariables>;

/**
 * __useGetSessionTokenMutation__
 *
 * To run a mutation, you first call `useGetSessionTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetSessionTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getSessionTokenMutation, { data, loading, error }] = useGetSessionTokenMutation({
 *   variables: {
 *      id: // value for 'id'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useGetSessionTokenMutation(baseOptions?: Apollo.MutationHookOptions<GetSessionTokenMutation, GetSessionTokenMutationVariables>) {
        return Apollo.useMutation<GetSessionTokenMutation, GetSessionTokenMutationVariables>(GetSessionTokenDocument, baseOptions);
      }
export type GetSessionTokenMutationHookResult = ReturnType<typeof useGetSessionTokenMutation>;
export type GetSessionTokenMutationResult = Apollo.MutationResult<GetSessionTokenMutation>;
export type GetSessionTokenMutationOptions = Apollo.BaseMutationOptions<GetSessionTokenMutation, GetSessionTokenMutationVariables>;