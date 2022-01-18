import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginAmbossMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LoginAmbossMutation = {
  __typename?: 'Mutation';
  loginAmboss: boolean;
};

export const LoginAmbossDocument = gql`
  mutation LoginAmboss {
    loginAmboss
  }
`;
export type LoginAmbossMutationFn = Apollo.MutationFunction<
  LoginAmbossMutation,
  LoginAmbossMutationVariables
>;

/**
 * __useLoginAmbossMutation__
 *
 * To run a mutation, you first call `useLoginAmbossMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginAmbossMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginAmbossMutation, { data, loading, error }] = useLoginAmbossMutation({
 *   variables: {
 *   },
 * });
 */
export function useLoginAmbossMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginAmbossMutation,
    LoginAmbossMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginAmbossMutation, LoginAmbossMutationVariables>(
    LoginAmbossDocument,
    options
  );
}
export type LoginAmbossMutationHookResult = ReturnType<
  typeof useLoginAmbossMutation
>;
export type LoginAmbossMutationResult =
  Apollo.MutationResult<LoginAmbossMutation>;
export type LoginAmbossMutationOptions = Apollo.BaseMutationOptions<
  LoginAmbossMutation,
  LoginAmbossMutationVariables
>;
