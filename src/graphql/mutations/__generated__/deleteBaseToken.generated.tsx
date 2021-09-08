/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type DeleteBaseTokenMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type DeleteBaseTokenMutation = { __typename?: 'Mutation', deleteBaseToken: boolean };


export const DeleteBaseTokenDocument = gql`
    mutation DeleteBaseToken {
  deleteBaseToken
}
    `;
export type DeleteBaseTokenMutationFn = Apollo.MutationFunction<DeleteBaseTokenMutation, DeleteBaseTokenMutationVariables>;

/**
 * __useDeleteBaseTokenMutation__
 *
 * To run a mutation, you first call `useDeleteBaseTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBaseTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBaseTokenMutation, { data, loading, error }] = useDeleteBaseTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteBaseTokenMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBaseTokenMutation, DeleteBaseTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBaseTokenMutation, DeleteBaseTokenMutationVariables>(DeleteBaseTokenDocument, options);
      }
export type DeleteBaseTokenMutationHookResult = ReturnType<typeof useDeleteBaseTokenMutation>;
export type DeleteBaseTokenMutationResult = Apollo.MutationResult<DeleteBaseTokenMutation>;
export type DeleteBaseTokenMutationOptions = Apollo.BaseMutationOptions<DeleteBaseTokenMutation, DeleteBaseTokenMutationVariables>;