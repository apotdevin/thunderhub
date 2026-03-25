import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NewTapAddressMutationVariables = Types.Exact<{
  assetId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  groupKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
  amt: Types.Scalars['Int']['input'];
}>;

export type NewTapAddressMutation = {
  __typename?: 'Mutation';
  newTapAddress: {
    __typename?: 'TapAddress';
    encoded: string;
    assetId: string;
    amount: string;
    scriptKey: string;
    internalKey: string;
    taprootOutputKey: string;
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
 *      assetId: // value for 'assetId'
 *      groupKey: // value for 'groupKey'
 *      amt: // value for 'amt'
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
