import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ClaimGhostAddressMutationVariables = Types.Exact<{
  address?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type ClaimGhostAddressMutation = {
  __typename?: 'Mutation';
  claimGhostAddress: { __typename?: 'ClaimGhostAddress'; username: string };
};

export const ClaimGhostAddressDocument = gql`
  mutation ClaimGhostAddress($address: String) {
    claimGhostAddress(address: $address) {
      username
    }
  }
`;
export type ClaimGhostAddressMutationFn = Apollo.MutationFunction<
  ClaimGhostAddressMutation,
  ClaimGhostAddressMutationVariables
>;

/**
 * __useClaimGhostAddressMutation__
 *
 * To run a mutation, you first call `useClaimGhostAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimGhostAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimGhostAddressMutation, { data, loading, error }] = useClaimGhostAddressMutation({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useClaimGhostAddressMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ClaimGhostAddressMutation,
    ClaimGhostAddressMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ClaimGhostAddressMutation,
    ClaimGhostAddressMutationVariables
  >(ClaimGhostAddressDocument, options);
}
export type ClaimGhostAddressMutationHookResult = ReturnType<
  typeof useClaimGhostAddressMutation
>;
export type ClaimGhostAddressMutationResult =
  Apollo.MutationResult<ClaimGhostAddressMutation>;
export type ClaimGhostAddressMutationOptions = Apollo.BaseMutationOptions<
  ClaimGhostAddressMutation,
  ClaimGhostAddressMutationVariables
>;
