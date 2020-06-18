import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type BosRebalanceMutationVariables = {
  auth: Types.AuthType;
};

export type BosRebalanceMutation = { __typename?: 'Mutation' } & {
  bosRebalance?: Types.Maybe<
    { __typename?: 'bosRebalanceResultType' } & {
      increase?: Types.Maybe<
        { __typename?: 'bosIncreaseType' } & Pick<
          Types.BosIncreaseType,
          | 'increased_inbound_on'
          | 'liquidity_inbound'
          | 'liquidity_inbound_opening'
          | 'liquidity_inbound_pending'
          | 'liquidity_outbound'
          | 'liquidity_outbound_opening'
          | 'liquidity_outbound_pending'
        >
      >;
      decrease?: Types.Maybe<
        { __typename?: 'bosDecreaseType' } & Pick<
          Types.BosDecreaseType,
          | 'decreased_inbound_on'
          | 'liquidity_inbound'
          | 'liquidity_inbound_opening'
          | 'liquidity_inbound_pending'
          | 'liquidity_outbound'
          | 'liquidity_outbound_opening'
          | 'liquidity_outbound_pending'
        >
      >;
      result?: Types.Maybe<
        { __typename?: 'bosResultType' } & Pick<
          Types.BosResultType,
          'rebalanced' | 'rebalance_fees_spent'
        >
      >;
    }
  >;
};

export const BosRebalanceDocument = gql`
  mutation BosRebalance($auth: authType!) {
    bosRebalance(auth: $auth) {
      increase {
        increased_inbound_on
        liquidity_inbound
        liquidity_inbound_opening
        liquidity_inbound_pending
        liquidity_outbound
        liquidity_outbound_opening
        liquidity_outbound_pending
      }
      decrease {
        decreased_inbound_on
        liquidity_inbound
        liquidity_inbound_opening
        liquidity_inbound_pending
        liquidity_outbound
        liquidity_outbound_opening
        liquidity_outbound_pending
      }
      result {
        rebalanced
        rebalance_fees_spent
      }
    }
  }
`;
export type BosRebalanceMutationFn = ApolloReactCommon.MutationFunction<
  BosRebalanceMutation,
  BosRebalanceMutationVariables
>;

/**
 * __useBosRebalanceMutation__
 *
 * To run a mutation, you first call `useBosRebalanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBosRebalanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bosRebalanceMutation, { data, loading, error }] = useBosRebalanceMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useBosRebalanceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    BosRebalanceMutation,
    BosRebalanceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    BosRebalanceMutation,
    BosRebalanceMutationVariables
  >(BosRebalanceDocument, baseOptions);
}
export type BosRebalanceMutationHookResult = ReturnType<
  typeof useBosRebalanceMutation
>;
export type BosRebalanceMutationResult = ApolloReactCommon.MutationResult<
  BosRebalanceMutation
>;
export type BosRebalanceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  BosRebalanceMutation,
  BosRebalanceMutationVariables
>;
