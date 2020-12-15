/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CreateBaseTokenMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type CreateBaseTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'createBaseToken'>
);


export const CreateBaseTokenDocument = gql`
    mutation CreateBaseToken($id: String!) {
  createBaseToken(id: $id)
}
    `;
export type CreateBaseTokenMutationFn = Apollo.MutationFunction<CreateBaseTokenMutation, CreateBaseTokenMutationVariables>;

/**
 * __useCreateBaseTokenMutation__
 *
 * To run a mutation, you first call `useCreateBaseTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBaseTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBaseTokenMutation, { data, loading, error }] = useCreateBaseTokenMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCreateBaseTokenMutation(baseOptions?: Apollo.MutationHookOptions<CreateBaseTokenMutation, CreateBaseTokenMutationVariables>) {
        return Apollo.useMutation<CreateBaseTokenMutation, CreateBaseTokenMutationVariables>(CreateBaseTokenDocument, baseOptions);
      }
export type CreateBaseTokenMutationHookResult = ReturnType<typeof useCreateBaseTokenMutation>;
export type CreateBaseTokenMutationResult = Apollo.MutationResult<CreateBaseTokenMutation>;
export type CreateBaseTokenMutationOptions = Apollo.BaseMutationOptions<CreateBaseTokenMutation, CreateBaseTokenMutationVariables>;