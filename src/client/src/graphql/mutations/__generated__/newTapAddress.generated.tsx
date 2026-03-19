import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type NewTapAddressMutationVariables = {
  assetId?: string | null;
  groupKey?: string | null;
  amt: number;
};

export type NewTapAddressMutation = {
  __typename?: 'Mutation';
  newTapAddress: {
    __typename?: 'TapAddress';
    encoded?: string | null;
    assetId?: string | null;
    amount?: string | null;
    scriptKey?: string | null;
    internalKey?: string | null;
    taprootOutputKey?: string | null;
  };
};

export const NewTapAddressDocument = gql`
  mutation NewTapAddress($assetId: String, $groupKey: String, $amt: Int!) {
    newTapAddress(assetId: $assetId, groupKey: $groupKey, amt: $amt) {
      encoded
      assetId
      amount
      scriptKey
      internalKey
      taprootOutputKey
    }
  }
`;

export function useNewTapAddressMutation(
  baseOptions?: Apollo.MutationHookOptions<
    NewTapAddressMutation,
    NewTapAddressMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    NewTapAddressMutation,
    NewTapAddressMutationVariables
  >(NewTapAddressDocument, options);
}
