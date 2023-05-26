import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OpenChannelMutationVariables = Types.Exact<{
  amount: Types.Scalars['Float']['input'];
  partnerPublicKey: Types.Scalars['String']['input'];
  tokensPerVByte?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  isPrivate?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  pushTokens?: Types.InputMaybe<Types.Scalars['Float']['input']>;
}>;

export type OpenChannelMutation = {
  __typename?: 'Mutation';
  openChannel: {
    __typename?: 'OpenOrCloseChannel';
    transactionId: string;
    transactionOutputIndex: string;
  };
};

export const OpenChannelDocument = gql`
  mutation OpenChannel(
    $amount: Float!
    $partnerPublicKey: String!
    $tokensPerVByte: Float
    $isPrivate: Boolean
    $pushTokens: Float
  ) {
    openChannel(
      amount: $amount
      partnerPublicKey: $partnerPublicKey
      tokensPerVByte: $tokensPerVByte
      isPrivate: $isPrivate
      pushTokens: $pushTokens
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type OpenChannelMutationFn = Apollo.MutationFunction<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;

/**
 * __useOpenChannelMutation__
 *
 * To run a mutation, you first call `useOpenChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOpenChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [openChannelMutation, { data, loading, error }] = useOpenChannelMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      partnerPublicKey: // value for 'partnerPublicKey'
 *      tokensPerVByte: // value for 'tokensPerVByte'
 *      isPrivate: // value for 'isPrivate'
 *      pushTokens: // value for 'pushTokens'
 *   },
 * });
 */
export function useOpenChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OpenChannelMutation,
    OpenChannelMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<OpenChannelMutation, OpenChannelMutationVariables>(
    OpenChannelDocument,
    options
  );
}
export type OpenChannelMutationHookResult = ReturnType<
  typeof useOpenChannelMutation
>;
export type OpenChannelMutationResult =
  Apollo.MutationResult<OpenChannelMutation>;
export type OpenChannelMutationOptions = Apollo.BaseMutationOptions<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;
