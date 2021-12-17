import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type PayAddressMutationVariables = Types.Exact<{
  address: Types.Scalars['String'];
  tokens?: Types.InputMaybe<Types.Scalars['Float']>;
  fee?: Types.InputMaybe<Types.Scalars['Float']>;
  target?: Types.InputMaybe<Types.Scalars['Float']>;
  sendAll?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;

export type PayAddressMutation = {
  __typename?: 'Mutation';
  sendToAddress: {
    __typename?: 'ChainAddressSend';
    confirmationCount: number;
    id: string;
    isConfirmed: boolean;
    isOutgoing: boolean;
    tokens?: number | null | undefined;
  };
};

export const PayAddressDocument = gql`
  mutation PayAddress(
    $address: String!
    $tokens: Float
    $fee: Float
    $target: Float
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
export type PayAddressMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    PayAddressMutation,
    PayAddressMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PayAddressMutation, PayAddressMutationVariables>(
    PayAddressDocument,
    options
  );
}
export type PayAddressMutationHookResult = ReturnType<
  typeof usePayAddressMutation
>;
export type PayAddressMutationResult =
  Apollo.MutationResult<PayAddressMutation>;
export type PayAddressMutationOptions = Apollo.BaseMutationOptions<
  PayAddressMutation,
  PayAddressMutationVariables
>;
