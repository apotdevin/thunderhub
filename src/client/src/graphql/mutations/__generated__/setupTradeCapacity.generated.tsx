import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SetupTradeCapacityMutationVariables = Types.Exact<{
  input: Types.SetupTradeCapacityInput;
}>;

export type SetupTradeCapacityMutation = {
  __typename?: 'Mutation';
  setupTradeCapacity: {
    __typename?: 'SetupTradeCapacityResult';
    success: boolean;
    magmaOrderId?: string | null;
    magmaOrderStatus?: string | null;
    magmaOrderAmountSats?: string | null;
    magmaOrderAmountAsset?: string | null;
    magmaOrderFeeSats?: string | null;
    outboundChannelTxid?: string | null;
    outboundChannelOutputIndex?: number | null;
    skippedMagmaOrder?: boolean | null;
    skippedOutboundChannel?: boolean | null;
  };
};

export const SetupTradeCapacityDocument = gql`
  mutation SetupTradeCapacity($input: SetupTradeCapacityInput!) {
    setupTradeCapacity(input: $input) {
      success
      magmaOrderId
      magmaOrderStatus
      magmaOrderAmountSats
      magmaOrderAmountAsset
      magmaOrderFeeSats
      outboundChannelTxid
      outboundChannelOutputIndex
      skippedMagmaOrder
      skippedOutboundChannel
    }
  }
`;
export type SetupTradeCapacityMutationFn = Apollo.MutationFunction<
  SetupTradeCapacityMutation,
  SetupTradeCapacityMutationVariables
>;

/**
 * __useSetupTradeCapacityMutation__
 *
 * To run a mutation, you first call `useSetupTradeCapacityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetupTradeCapacityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setupTradeCapacityMutation, { data, loading, error }] = useSetupTradeCapacityMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetupTradeCapacityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetupTradeCapacityMutation,
    SetupTradeCapacityMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SetupTradeCapacityMutation,
    SetupTradeCapacityMutationVariables
  >(SetupTradeCapacityDocument, options);
}
export type SetupTradeCapacityMutationHookResult = ReturnType<
  typeof useSetupTradeCapacityMutation
>;
export type SetupTradeCapacityMutationResult =
  Apollo.MutationResult<SetupTradeCapacityMutation>;
export type SetupTradeCapacityMutationOptions = Apollo.BaseMutationOptions<
  SetupTradeCapacityMutation,
  SetupTradeCapacityMutationVariables
>;
