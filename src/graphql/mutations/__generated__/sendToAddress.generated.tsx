import {
  gql,
  MutationFunction,
  useMutation,
  MutationHookOptions,
  BaseMutationOptions,
  MutationResult,
} from '@apollo/client';
import * as Types from '../../types';

export type PayAddressMutationVariables = Types.Exact<{
  address: Types.Scalars['String'];
  tokens?: Types.Maybe<Types.Scalars['Int']>;
  fee?: Types.Maybe<Types.Scalars['Int']>;
  target?: Types.Maybe<Types.Scalars['Int']>;
  sendAll?: Types.Maybe<Types.Scalars['Boolean']>;
}>;

export type PayAddressMutation = { __typename?: 'Mutation' } & {
  sendToAddress?: Types.Maybe<
    { __typename?: 'sendToType' } & Pick<
      Types.SendToType,
      'confirmationCount' | 'id' | 'isConfirmed' | 'isOutgoing' | 'tokens'
    >
  >;
};

export const PayAddressDocument = gql`
  mutation PayAddress(
    $address: String!
    $tokens: Int
    $fee: Int
    $target: Int
    $sendAll: Boolean
  ) {
    sendToAddress(
      address: $address
      tokens: $tokens
      fee: $fee
      target: $target
      sendAll: $sendAll
    ) {
      confirmationCount
      id
      isConfirmed
      isOutgoing
      tokens
    }
  }
`;
export type PayAddressMutationFn = MutationFunction<
  PayAddressMutation,
  PayAddressMutationVariables
>;

/**
 * __usePayAddressMutation__
 *
 * To run a mutation, you first call `usePayAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payAddressMutation, { data, loading, error }] = usePayAddressMutation({
 *   variables: {
 *      address: // value for 'address'
 *      tokens: // value for 'tokens'
 *      fee: // value for 'fee'
 *      target: // value for 'target'
 *      sendAll: // value for 'sendAll'
 *   },
 * });
 */
export function usePayAddressMutation(
  baseOptions?: MutationHookOptions<
    PayAddressMutation,
    PayAddressMutationVariables
  >
) {
  return useMutation<PayAddressMutation, PayAddressMutationVariables>(
    PayAddressDocument,
    baseOptions
  );
}
export type PayAddressMutationHookResult = ReturnType<
  typeof usePayAddressMutation
>;
export type PayAddressMutationResult = MutationResult<PayAddressMutation>;
export type PayAddressMutationOptions = BaseMutationOptions<
  PayAddressMutation,
  PayAddressMutationVariables
>;
