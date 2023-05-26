import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CloseChannelMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  forceClose?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  target?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  tokens?: Types.InputMaybe<Types.Scalars['Float']['input']>;
}>;

export type CloseChannelMutation = {
  __typename?: 'Mutation';
  closeChannel: {
    __typename?: 'OpenOrCloseChannel';
    transactionId: string;
    transactionOutputIndex: string;
  };
};

export const CloseChannelDocument = gql`
  mutation CloseChannel(
    $id: String!
    $forceClose: Boolean
    $target: Float
    $tokens: Float
  ) {
    closeChannel(
      id: $id
      forceClose: $forceClose
      targetConfirmations: $target
      tokensPerVByte: $tokens
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type CloseChannelMutationFn = Apollo.MutationFunction<
  CloseChannelMutation,
  CloseChannelMutationVariables
>;

/**
 * __useCloseChannelMutation__
 *
 * To run a mutation, you first call `useCloseChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCloseChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closeChannelMutation, { data, loading, error }] = useCloseChannelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      forceClose: // value for 'forceClose'
 *      target: // value for 'target'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function useCloseChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CloseChannelMutation,
    CloseChannelMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CloseChannelMutation,
    CloseChannelMutationVariables
  >(CloseChannelDocument, options);
}
export type CloseChannelMutationHookResult = ReturnType<
  typeof useCloseChannelMutation
>;
export type CloseChannelMutationResult =
  Apollo.MutationResult<CloseChannelMutation>;
export type CloseChannelMutationOptions = Apollo.BaseMutationOptions<
  CloseChannelMutation,
  CloseChannelMutationVariables
>;
