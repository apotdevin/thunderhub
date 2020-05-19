import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type CloseChannelMutationVariables = {
  id: Types.Scalars['String'];
  auth: Types.AuthType;
  forceClose?: Types.Maybe<Types.Scalars['Boolean']>;
  target?: Types.Maybe<Types.Scalars['Int']>;
  tokens?: Types.Maybe<Types.Scalars['Int']>;
};

export type CloseChannelMutation = { __typename?: 'Mutation' } & {
  closeChannel?: Types.Maybe<
    { __typename?: 'closeChannelType' } & Pick<
      Types.CloseChannelType,
      'transactionId' | 'transactionOutputIndex'
    >
  >;
};

export const CloseChannelDocument = gql`
  mutation CloseChannel(
    $id: String!
    $auth: authType!
    $forceClose: Boolean
    $target: Int
    $tokens: Int
  ) {
    closeChannel(
      id: $id
      forceClose: $forceClose
      targetConfirmations: $target
      tokensPerVByte: $tokens
      auth: $auth
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type CloseChannelMutationFn = ApolloReactCommon.MutationFunction<
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
 *      auth: // value for 'auth'
 *      forceClose: // value for 'forceClose'
 *      target: // value for 'target'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function useCloseChannelMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CloseChannelMutation,
    CloseChannelMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CloseChannelMutation,
    CloseChannelMutationVariables
  >(CloseChannelDocument, baseOptions);
}
export type CloseChannelMutationHookResult = ReturnType<
  typeof useCloseChannelMutation
>;
export type CloseChannelMutationResult = ApolloReactCommon.MutationResult<
  CloseChannelMutation
>;
export type CloseChannelMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CloseChannelMutation,
  CloseChannelMutationVariables
>;
