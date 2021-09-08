/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UpdateMultipleFeesMutationVariables = Types.Exact<{
  channels: Array<Types.ChannelDetailInput> | Types.ChannelDetailInput;
}>;


export type UpdateMultipleFeesMutation = { __typename?: 'Mutation', updateMultipleFees?: Types.Maybe<boolean> };


export const UpdateMultipleFeesDocument = gql`
    mutation UpdateMultipleFees($channels: [channelDetailInput!]!) {
  updateMultipleFees(channels: $channels)
}
    `;
export type UpdateMultipleFeesMutationFn = Apollo.MutationFunction<UpdateMultipleFeesMutation, UpdateMultipleFeesMutationVariables>;

/**
 * __useUpdateMultipleFeesMutation__
 *
 * To run a mutation, you first call `useUpdateMultipleFeesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMultipleFeesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMultipleFeesMutation, { data, loading, error }] = useUpdateMultipleFeesMutation({
 *   variables: {
 *      channels: // value for 'channels'
 *   },
 * });
 */
export function useUpdateMultipleFeesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMultipleFeesMutation, UpdateMultipleFeesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMultipleFeesMutation, UpdateMultipleFeesMutationVariables>(UpdateMultipleFeesDocument, options);
      }
export type UpdateMultipleFeesMutationHookResult = ReturnType<typeof useUpdateMultipleFeesMutation>;
export type UpdateMultipleFeesMutationResult = Apollo.MutationResult<UpdateMultipleFeesMutation>;
export type UpdateMultipleFeesMutationOptions = Apollo.BaseMutationOptions<UpdateMultipleFeesMutation, UpdateMultipleFeesMutationVariables>;