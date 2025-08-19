import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PurchaseLiquidityMutationVariables = Types.Exact<{
  amount_cents: Types.Scalars['String']['input'];
}>;

export type PurchaseLiquidityMutation = {
  __typename?: 'Mutation';
  purchaseLiquidity: boolean;
};

export const PurchaseLiquidityDocument = gql`
  mutation PurchaseLiquidity($amount_cents: String!) {
    purchaseLiquidity(amount_cents: $amount_cents)
  }
`;
export type PurchaseLiquidityMutationFn = Apollo.MutationFunction<
  PurchaseLiquidityMutation,
  PurchaseLiquidityMutationVariables
>;

/**
 * __usePurchaseLiquidityMutation__
 *
 * To run a mutation, you first call `usePurchaseLiquidityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePurchaseLiquidityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [purchaseLiquidityMutation, { data, loading, error }] = usePurchaseLiquidityMutation({
 *   variables: {
 *      amount_cents: // value for 'amount_cents'
 *   },
 * });
 */
export function usePurchaseLiquidityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PurchaseLiquidityMutation,
    PurchaseLiquidityMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PurchaseLiquidityMutation,
    PurchaseLiquidityMutationVariables
  >(PurchaseLiquidityDocument, options);
}
export type PurchaseLiquidityMutationHookResult = ReturnType<
  typeof usePurchaseLiquidityMutation
>;
export type PurchaseLiquidityMutationResult =
  Apollo.MutationResult<PurchaseLiquidityMutation>;
export type PurchaseLiquidityMutationOptions = Apollo.BaseMutationOptions<
  PurchaseLiquidityMutation,
  PurchaseLiquidityMutationVariables
>;
