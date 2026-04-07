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
      outboundChannelTxid
      outboundChannelOutputIndex
    }
  }
`;
export type SetupTradePartnerMutationFn = Apollo.MutationFunction<
  SetupTradePartnerMutation,
  SetupTradePartnerMutationVariables
>;

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
