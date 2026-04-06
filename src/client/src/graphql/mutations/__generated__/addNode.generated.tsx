import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddNodeMutationVariables = Types.Exact<{
  input: Types.AddNodeInput;
}>;

export type AddNodeMutation = {
  __typename?: 'Mutation';
  team: {
    __typename?: 'TeamMutations';
    add_node: {
      __typename?: 'AddNodeResult';
      id: string;
      slug: string;
      name: string;
    };
  };
};

export const AddNodeDocument = gql`
  mutation AddNode($input: AddNodeInput!) {
    team {
      add_node(input: $input) {
        id
        slug
        name
      }
    }
  }
`;
export type AddNodeMutationFn = Apollo.MutationFunction<
  AddNodeMutation,
  AddNodeMutationVariables
>;

/**
 * __useAddNodeMutation__
 *
 * To run a mutation, you first call `useAddNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNodeMutation, { data, loading, error }] = useAddNodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddNodeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddNodeMutation,
    AddNodeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddNodeMutation, AddNodeMutationVariables>(
    AddNodeDocument,
    options
  );
}
export type AddNodeMutationHookResult = ReturnType<typeof useAddNodeMutation>;
export type AddNodeMutationResult = Apollo.MutationResult<AddNodeMutation>;
export type AddNodeMutationOptions = Apollo.BaseMutationOptions<
  AddNodeMutation,
  AddNodeMutationVariables
>;
