import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type KeysendMutationVariables = {
  destination: Types.Scalars['String'];
  auth: Types.AuthType;
  tokens: Types.Scalars['Int'];
};

export type KeysendMutation = { __typename?: 'Mutation' } & {
  keysend?: Types.Maybe<
    { __typename?: 'payType' } & Pick<Types.PayType, 'is_confirmed'>
  >;
};

export const KeysendDocument = gql`
  mutation Keysend($destination: String!, $auth: authType!, $tokens: Int!) {
    keysend(destination: $destination, auth: $auth, tokens: $tokens) {
      is_confirmed
    }
  }
`;
export type KeysendMutationFn = ApolloReactCommon.MutationFunction<
  KeysendMutation,
  KeysendMutationVariables
>;

/**
 * __useKeysendMutation__
 *
 * To run a mutation, you first call `useKeysendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useKeysendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [keysendMutation, { data, loading, error }] = useKeysendMutation({
 *   variables: {
 *      destination: // value for 'destination'
 *      auth: // value for 'auth'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function useKeysendMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    KeysendMutation,
    KeysendMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    KeysendMutation,
    KeysendMutationVariables
  >(KeysendDocument, baseOptions);
}
export type KeysendMutationHookResult = ReturnType<typeof useKeysendMutation>;
export type KeysendMutationResult = ApolloReactCommon.MutationResult<
  KeysendMutation
>;
export type KeysendMutationOptions = ApolloReactCommon.BaseMutationOptions<
  KeysendMutation,
  KeysendMutationVariables
>;
