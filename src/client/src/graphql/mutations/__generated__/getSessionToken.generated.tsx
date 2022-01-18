import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetSessionTokenMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  password: Types.Scalars['String'];
  token?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type GetSessionTokenMutation = {
  __typename?: 'Mutation';
  getSessionToken: string;
};

export const GetSessionTokenDocument = gql`
  mutation GetSessionToken($id: String!, $password: String!, $token: String) {
    getSessionToken(id: $id, password: $password, token: $token)
  }
`;
export type GetSessionTokenMutationFn = Apollo.MutationFunction<
  GetSessionTokenMutation,
  GetSessionTokenMutationVariables
>;

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
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetSessionTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GetSessionTokenMutation,
    GetSessionTokenMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GetSessionTokenMutation,
    GetSessionTokenMutationVariables
  >(GetSessionTokenDocument, options);
}
export type GetSessionTokenMutationHookResult = ReturnType<
  typeof useGetSessionTokenMutation
>;
export type GetSessionTokenMutationResult =
  Apollo.MutationResult<GetSessionTokenMutation>;
export type GetSessionTokenMutationOptions = Apollo.BaseMutationOptions<
  GetSessionTokenMutation,
  GetSessionTokenMutationVariables
>;
