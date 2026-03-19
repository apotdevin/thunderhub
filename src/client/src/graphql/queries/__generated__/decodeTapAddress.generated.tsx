import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type DecodeTapAddressQueryVariables = {
  addr: string;
};

export type DecodeTapAddressQuery = {
  __typename?: 'Query';
  decodeTapAddress: {
    __typename?: 'TapAddress';
    encoded?: string | null;
    assetId?: string | null;
    groupKey?: string | null;
    amount?: string | null;
    assetType?: string | null;
  };
};

export const DecodeTapAddressDocument = gql`
  query DecodeTapAddress($addr: String!) {
    decodeTapAddress(addr: $addr) {
      encoded
      assetId
      groupKey
      amount
      assetType
    }
  }
`;

export function useDecodeTapAddressLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DecodeTapAddressQuery,
    DecodeTapAddressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DecodeTapAddressQuery,
    DecodeTapAddressQueryVariables
  >(DecodeTapAddressDocument, options);
}
