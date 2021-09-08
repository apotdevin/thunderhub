/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type BosRebalanceMutationVariables = Types.Exact<{
  avoid?: Types.Maybe<Array<Types.Maybe<Types.Scalars['String']>> | Types.Maybe<Types.Scalars['String']>>;
  in_through?: Types.Maybe<Types.Scalars['String']>;
  max_fee?: Types.Maybe<Types.Scalars['Int']>;
  max_fee_rate?: Types.Maybe<Types.Scalars['Int']>;
  max_rebalance?: Types.Maybe<Types.Scalars['Int']>;
  timeout_minutes?: Types.Maybe<Types.Scalars['Int']>;
  node?: Types.Maybe<Types.Scalars['String']>;
  out_through?: Types.Maybe<Types.Scalars['String']>;
  out_inbound?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type BosRebalanceMutation = { __typename?: 'Mutation', bosRebalance?: Types.Maybe<{ __typename?: 'bosRebalanceResultType', increase?: Types.Maybe<{ __typename?: 'bosIncreaseType', increased_inbound_on?: Types.Maybe<string>, liquidity_inbound?: Types.Maybe<string>, liquidity_inbound_opening?: Types.Maybe<string>, liquidity_inbound_pending?: Types.Maybe<string>, liquidity_outbound?: Types.Maybe<string>, liquidity_outbound_opening?: Types.Maybe<string>, liquidity_outbound_pending?: Types.Maybe<string> }>, decrease?: Types.Maybe<{ __typename?: 'bosDecreaseType', decreased_inbound_on?: Types.Maybe<string>, liquidity_inbound?: Types.Maybe<string>, liquidity_inbound_opening?: Types.Maybe<string>, liquidity_inbound_pending?: Types.Maybe<string>, liquidity_outbound?: Types.Maybe<string>, liquidity_outbound_opening?: Types.Maybe<string>, liquidity_outbound_pending?: Types.Maybe<string> }>, result?: Types.Maybe<{ __typename?: 'bosResultType', rebalanced?: Types.Maybe<string>, rebalance_fees_spent?: Types.Maybe<string> }> }> };


export const BosRebalanceDocument = gql`
    mutation BosRebalance($avoid: [String], $in_through: String, $max_fee: Int, $max_fee_rate: Int, $max_rebalance: Int, $timeout_minutes: Int, $node: String, $out_through: String, $out_inbound: Int) {
  bosRebalance(
    avoid: $avoid
    in_through: $in_through
    max_fee: $max_fee
    max_fee_rate: $max_fee_rate
    max_rebalance: $max_rebalance
    timeout_minutes: $timeout_minutes
    node: $node
    out_through: $out_through
    out_inbound: $out_inbound
  ) {
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
export type BosRebalanceMutationFn = Apollo.MutationFunction<BosRebalanceMutation, BosRebalanceMutationVariables>;

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
 *      avoid: // value for 'avoid'
 *      in_through: // value for 'in_through'
 *      max_fee: // value for 'max_fee'
 *      max_fee_rate: // value for 'max_fee_rate'
 *      max_rebalance: // value for 'max_rebalance'
 *      timeout_minutes: // value for 'timeout_minutes'
 *      node: // value for 'node'
 *      out_through: // value for 'out_through'
 *      out_inbound: // value for 'out_inbound'
 *   },
 * });
 */
export function useBosRebalanceMutation(baseOptions?: Apollo.MutationHookOptions<BosRebalanceMutation, BosRebalanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BosRebalanceMutation, BosRebalanceMutationVariables>(BosRebalanceDocument, options);
      }
export type BosRebalanceMutationHookResult = ReturnType<typeof useBosRebalanceMutation>;
export type BosRebalanceMutationResult = Apollo.MutationResult<BosRebalanceMutation>;
export type BosRebalanceMutationOptions = Apollo.BaseMutationOptions<BosRebalanceMutation, BosRebalanceMutationVariables>;