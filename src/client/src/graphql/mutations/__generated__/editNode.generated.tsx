import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EditNodeMutationVariables = Types.Exact<{
  input: Types.EditNodeInput;
}>;

export type EditNodeMutation = {
  __typename?: 'Mutation';
  team: {
    __typename?: 'TeamMutations';
    edit_node: {
      __typename?: 'EditNodeResult';
      id: string;
      slug: string;
      name: string;
    };
  };
};

export const EditNodeDocument = gql`
  mutation EditNode($input: EditNodeInput!) {
    team {
      edit_node(input: $input) {
        id
        slug
        name
      }
    }
  }
`;
export type EditNodeMutationFn = Apollo.MutationFunction<
  EditNodeMutation,
  EditNodeMutationVariables
>;

/**
 * __useEditNodeMutation__
 *
 * To run a mutation, you first call `useEditNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editNodeMutation, { data, loading, error }] = useEditNodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditNodeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    EditNodeMutation,
    EditNodeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<EditNodeMutation, EditNodeMutationVariables>(
    EditNodeDocument,
    options
  );
}
export type EditNodeMutationHookResult = ReturnType<typeof useEditNodeMutation>;
export type EditNodeMutationResult = Apollo.MutationResult<EditNodeMutation>;
export type EditNodeMutationOptions = Apollo.BaseMutationOptions<
  EditNodeMutation,
  EditNodeMutationVariables
>;
