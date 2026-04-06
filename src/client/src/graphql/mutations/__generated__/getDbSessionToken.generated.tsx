import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetDbSessionTokenMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;

export type GetDbSessionTokenMutation = {
  __typename?: 'Mutation';
  public: { __typename?: 'PublicMutation'; get_db_session_token: boolean };
};

export const GetDbSessionTokenDocument = gql`
  mutation GetDbSessionToken($email: String!, $password: String!) {
    public {
      get_db_session_token(email: $email, password: $password)
    }
  }
`;
export type GetDbSessionTokenMutationFn = Apollo.MutationFunction<
  GetDbSessionTokenMutation,
  GetDbSessionTokenMutationVariables
>;

/**
 * __useGetDbSessionTokenMutation__
 *
 * To run a mutation, you first call `useGetDbSessionTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetDbSessionTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getDbSessionTokenMutation, { data, loading, error }] = useGetDbSessionTokenMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useGetDbSessionTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GetDbSessionTokenMutation,
    GetDbSessionTokenMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GetDbSessionTokenMutation,
    GetDbSessionTokenMutationVariables
  >(GetDbSessionTokenDocument, options);
}
export type GetDbSessionTokenMutationHookResult = ReturnType<
  typeof useGetDbSessionTokenMutation
>;
export type GetDbSessionTokenMutationResult =
  Apollo.MutationResult<GetDbSessionTokenMutation>;
export type GetDbSessionTokenMutationOptions = Apollo.BaseMutationOptions<
  GetDbSessionTokenMutation,
  GetDbSessionTokenMutationVariables
>;
