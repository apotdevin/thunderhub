import * as Apollo from '@apollo/client';
import * as Types from '../../types';

const gql = Apollo.gql;

export type KeysendMutationVariables = Types.Exact<{
  destination: Types.Scalars['String'];
  tokens: Types.Scalars['Int'];
}>;

export type KeysendMutation = { __typename?: 'Mutation' } & {
  keysend?: Types.Maybe<
    { __typename?: 'payType' } & Pick<Types.PayType, 'is_confirmed'>
  >;
};

export const KeysendDocument = gql`
  mutation Keysend($destination: String!, $tokens: Int!) {
    keysend(destination: $destination, tokens: $tokens) {
      is_confirmed
    }
  }
`;
export type KeysendMutationFn = Apollo.MutationFunction<
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
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function useKeysendMutation(
  baseOptions?: Apollo.MutationHookOptions<
    KeysendMutation,
    KeysendMutationVariables
  >
) {
  return Apollo.useMutation<KeysendMutation, KeysendMutationVariables>(
    KeysendDocument,
    baseOptions
  );
}
export type KeysendMutationHookResult = ReturnType<typeof useKeysendMutation>;
export type KeysendMutationResult = Apollo.MutationResult<KeysendMutation>;
export type KeysendMutationOptions = Apollo.BaseMutationOptions<
  KeysendMutation,
  KeysendMutationVariables
>;
