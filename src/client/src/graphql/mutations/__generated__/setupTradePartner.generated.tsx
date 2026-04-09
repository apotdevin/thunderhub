import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SetupTradePartnerMutationVariables = Types.Exact<{
  input: Types.SetupTradePartnerInput;
}>;

export type SetupTradePartnerMutation = {
  __typename?: 'Mutation';
  setupTradePartner: {
    __typename?: 'SetupTradePartnerResult';
    success: boolean;
    magmaOrderId?: string | null;
    magmaOrderStatus?: string | null;
    magmaOrderAmountSats?: string | null;
    magmaOrderAmountAsset?: string | null;
    magmaOrderFeeSats?: string | null;
    outboundChannelTxid?: string | null;
    outboundChannelOutputIndex?: number | null;
  };
};

export const SetupTradePartnerDocument = gql`
  mutation SetupTradePartner($input: SetupTradePartnerInput!) {
    setupTradePartner(input: $input) {
      success
      magmaOrderId
      magmaOrderStatus
      magmaOrderAmountSats
      magmaOrderAmountAsset
      magmaOrderFeeSats
      outboundChannelTxid
      outboundChannelOutputIndex
    }
  }
`;
export type SetupTradePartnerMutationFn = Apollo.MutationFunction<
  SetupTradePartnerMutation,
  SetupTradePartnerMutationVariables
>;

/**
 * __useSetupTradePartnerMutation__
 *
 * To run a mutation, you first call `useSetupTradePartnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetupTradePartnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setupTradePartnerMutation, { data, loading, error }] = useSetupTradePartnerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetupTradePartnerMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetupTradePartnerMutation,
    SetupTradePartnerMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SetupTradePartnerMutation,
    SetupTradePartnerMutationVariables
  >(SetupTradePartnerDocument, options);
}
export type SetupTradePartnerMutationHookResult = ReturnType<
  typeof useSetupTradePartnerMutation
>;
export type SetupTradePartnerMutationResult =
  Apollo.MutationResult<SetupTradePartnerMutation>;
export type SetupTradePartnerMutationOptions = Apollo.BaseMutationOptions<
  SetupTradePartnerMutation,
  SetupTradePartnerMutationVariables
>;
