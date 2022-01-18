import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAuthTokenMutationVariables = Types.Exact<{
  cookie?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type GetAuthTokenMutation = {
  __typename?: 'Mutation';
  getAuthToken: boolean;
};

export const GetAuthTokenDocument = gql`
  mutation GetAuthToken($cookie: String) {
    getAuthToken(cookie: $cookie)
  }
`;
export type GetAuthTokenMutationFn = Apollo.MutationFunction<
  GetAuthTokenMutation,
  GetAuthTokenMutationVariables
>;

/**
 * __useGetAuthTokenMutation__
 *
 * To run a mutation, you first call `useGetAuthTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetAuthTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getAuthTokenMutation, { data, loading, error }] = useGetAuthTokenMutation({
 *   variables: {
 *      cookie: // value for 'cookie'
 *   },
 * });
 */
export function useGetAuthTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GetAuthTokenMutation,
    GetAuthTokenMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GetAuthTokenMutation,
    GetAuthTokenMutationVariables
  >(GetAuthTokenDocument, options);
}
export type GetAuthTokenMutationHookResult = ReturnType<
  typeof useGetAuthTokenMutation
>;
export type GetAuthTokenMutationResult =
  Apollo.MutationResult<GetAuthTokenMutation>;
export type GetAuthTokenMutationOptions = Apollo.BaseMutationOptions<
  GetAuthTokenMutation,
  GetAuthTokenMutationVariables
>;
