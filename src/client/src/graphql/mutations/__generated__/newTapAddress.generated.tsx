import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NewTapAddressMutationVariables = Types.Exact<{
  asset_id?: Types.InputMaybe<Types.Scalars['String']['input']>;
  group_key?: Types.InputMaybe<Types.Scalars['String']['input']>;
  amt: Types.Scalars['String']['input'];
  proof_courier_addr?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type NewTapAddressMutation = {
  __typename?: 'Mutation';
  taproot_assets: {
    __typename?: 'TaprootAssetsMutations';
    new_address: {
      __typename?: 'TapAddress';
      encoded: string;
      asset_id: string;
      amount: string;
      script_key: string;
      internal_key: string;
      taproot_output_key: string;
    };
  };
};

export const NewTapAddressDocument = gql`
  mutation NewTapAddress(
    $asset_id: String
    $group_key: String
    $amt: String!
    $proof_courier_addr: String
  ) {
    taproot_assets {
      new_address(
        asset_id: $asset_id
        group_key: $group_key
        amt: $amt
        proof_courier_addr: $proof_courier_addr
      ) {
        encoded
        asset_id
        amount
        script_key
        internal_key
        taproot_output_key
      }
    }
  }
`;
export type NewTapAddressMutationFn = Apollo.MutationFunction<
  NewTapAddressMutation,
  NewTapAddressMutationVariables
>;

/**
 * __useNewTapAddressMutation__
 *
 * To run a mutation, you first call `useNewTapAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewTapAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newTapAddressMutation, { data, loading, error }] = useNewTapAddressMutation({
 *   variables: {
 *      asset_id: // value for 'asset_id'
 *      group_key: // value for 'group_key'
 *      amt: // value for 'amt'
 *      proof_courier_addr: // value for 'proof_courier_addr'
 *   },
 * });
 */
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
export type NewTapAddressMutationHookResult = ReturnType<
  typeof useNewTapAddressMutation
>;
export type NewTapAddressMutationResult =
  Apollo.MutationResult<NewTapAddressMutation>;
export type NewTapAddressMutationOptions = Apollo.BaseMutationOptions<
  NewTapAddressMutation,
  NewTapAddressMutationVariables
>;
