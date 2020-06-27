import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type BosRebalanceMutationVariables = Types.Exact<{
  auth: Types.AuthType;
  avoid?: Types.Maybe<Array<Types.Maybe<Types.Scalars['String']>>>;
  in_through?: Types.Maybe<Types.Scalars['String']>;
  is_avoiding_high_inbound?: Types.Maybe<Types.Scalars['Boolean']>;
  max_fee?: Types.Maybe<Types.Scalars['Int']>;
  max_fee_rate?: Types.Maybe<Types.Scalars['Int']>;
  max_rebalance?: Types.Maybe<Types.Scalars['Int']>;
  node?: Types.Maybe<Types.Scalars['String']>;
  out_channels?: Types.Maybe<Array<Types.Maybe<Types.Scalars['String']>>>;
  out_through?: Types.Maybe<Types.Scalars['String']>;
  target?: Types.Maybe<Types.Scalars['Int']>;
}>;

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
  mutation BosRebalance(
    $auth: authType!
    $avoid: [String]
    $in_through: String
    $is_avoiding_high_inbound: Boolean
    $max_fee: Int
    $max_fee_rate: Int
    $max_rebalance: Int
    $node: String
    $out_channels: [String]
    $out_through: String
    $target: Int
  ) {
    bosRebalance(
      auth: $auth
      avoid: $avoid
      in_through: $in_through
      is_avoiding_high_inbound: $is_avoiding_high_inbound
      max_fee: $max_fee
      max_fee_rate: $max_fee_rate
      max_rebalance: $max_rebalance
      node: $node
      out_channels: $out_channels
      out_through: $out_through
      target: $target
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
 *      avoid: // value for 'avoid'
 *      in_through: // value for 'in_through'
 *      is_avoiding_high_inbound: // value for 'is_avoiding_high_inbound'
 *      max_fee: // value for 'max_fee'
 *      max_fee_rate: // value for 'max_fee_rate'
 *      max_rebalance: // value for 'max_rebalance'
 *      node: // value for 'node'
 *      out_channels: // value for 'out_channels'
 *      out_through: // value for 'out_through'
 *      target: // value for 'target'
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
