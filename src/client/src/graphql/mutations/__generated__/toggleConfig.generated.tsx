import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ToggleConfigMutationVariables = Types.Exact<{
  field: Types.ConfigFields;
}>;

export type ToggleConfigMutation = {
  __typename?: 'Mutation';
  toggleConfig: boolean;
};

export const ToggleConfigDocument = gql`
  mutation ToggleConfig($field: ConfigFields!) {
    toggleConfig(field: $field)
  }
`;
export type ToggleConfigMutationFn = Apollo.MutationFunction<
  ToggleConfigMutation,
  ToggleConfigMutationVariables
>;

/**
 * __useToggleConfigMutation__
 *
 * To run a mutation, you first call `useToggleConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleConfigMutation, { data, loading, error }] = useToggleConfigMutation({
 *   variables: {
 *      field: // value for 'field'
 *   },
 * });
 */
export function useToggleConfigMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ToggleConfigMutation,
    ToggleConfigMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ToggleConfigMutation,
    ToggleConfigMutationVariables
  >(ToggleConfigDocument, options);
}
export type ToggleConfigMutationHookResult = ReturnType<
  typeof useToggleConfigMutation
>;
export type ToggleConfigMutationResult =
  Apollo.MutationResult<ToggleConfigMutation>;
export type ToggleConfigMutationOptions = Apollo.BaseMutationOptions<
  ToggleConfigMutation,
  ToggleConfigMutationVariables
>;
