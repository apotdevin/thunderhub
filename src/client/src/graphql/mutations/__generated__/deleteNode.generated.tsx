import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteNodeMutationVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
}>;

export type DeleteNodeMutation = {
  __typename?: 'Mutation';
  team: {
    __typename?: 'TeamMutations';
    delete_node: { __typename?: 'DeleteNodeResult'; success: boolean };
  };
};

export const DeleteNodeDocument = gql`
  mutation DeleteNode($slug: String!) {
    team {
      delete_node(slug: $slug) {
        success
      }
    }
  }
`;
export type DeleteNodeMutationFn = Apollo.MutationFunction<
  DeleteNodeMutation,
  DeleteNodeMutationVariables
>;

/**
 * __useDeleteNodeMutation__
 *
 * To run a mutation, you first call `useDeleteNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNodeMutation, { data, loading, error }] = useDeleteNodeMutation({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useDeleteNodeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteNodeMutation,
    DeleteNodeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteNodeMutation, DeleteNodeMutationVariables>(
    DeleteNodeDocument,
    options
  );
}
export type DeleteNodeMutationHookResult = ReturnType<
  typeof useDeleteNodeMutation
>;
export type DeleteNodeMutationResult =
  Apollo.MutationResult<DeleteNodeMutation>;
export type DeleteNodeMutationOptions = Apollo.BaseMutationOptions<
  DeleteNodeMutation,
  DeleteNodeMutationVariables
>;
