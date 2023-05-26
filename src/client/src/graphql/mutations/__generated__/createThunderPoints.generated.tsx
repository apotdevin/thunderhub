import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateThunderPointsMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  alias: Types.Scalars['String']['input'];
  uris:
    | Array<Types.Scalars['String']['input']>
    | Types.Scalars['String']['input'];
  public_key: Types.Scalars['String']['input'];
}>;

export type CreateThunderPointsMutation = {
  __typename?: 'Mutation';
  createThunderPoints: boolean;
};

export const CreateThunderPointsDocument = gql`
  mutation CreateThunderPoints(
    $id: String!
    $alias: String!
    $uris: [String!]!
    $public_key: String!
  ) {
    createThunderPoints(
      id: $id
      alias: $alias
      uris: $uris
      public_key: $public_key
    )
  }
`;
export type CreateThunderPointsMutationFn = Apollo.MutationFunction<
  CreateThunderPointsMutation,
  CreateThunderPointsMutationVariables
>;

/**
 * __useCreateThunderPointsMutation__
 *
 * To run a mutation, you first call `useCreateThunderPointsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThunderPointsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThunderPointsMutation, { data, loading, error }] = useCreateThunderPointsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      alias: // value for 'alias'
 *      uris: // value for 'uris'
 *      public_key: // value for 'public_key'
 *   },
 * });
 */
export function useCreateThunderPointsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateThunderPointsMutation,
    CreateThunderPointsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateThunderPointsMutation,
    CreateThunderPointsMutationVariables
  >(CreateThunderPointsDocument, options);
}
export type CreateThunderPointsMutationHookResult = ReturnType<
  typeof useCreateThunderPointsMutation
>;
export type CreateThunderPointsMutationResult =
  Apollo.MutationResult<CreateThunderPointsMutation>;
export type CreateThunderPointsMutationOptions = Apollo.BaseMutationOptions<
  CreateThunderPointsMutation,
  CreateThunderPointsMutationVariables
>;
