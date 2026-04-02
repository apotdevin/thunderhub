import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateInitialUserMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;

export type CreateInitialUserMutation = {
  __typename?: 'Mutation';
  public: {
    __typename?: 'PublicMutation';
    create_initial_user: {
      __typename?: 'CreateInitialUserResult';
      id: string;
      email: string;
      role: string;
    };
  };
};

export const CreateInitialUserDocument = gql`
  mutation CreateInitialUser($email: String!, $password: String!) {
    public {
      create_initial_user(email: $email, password: $password) {
        id
        email
        role
      }
    }
  }
`;
export type CreateInitialUserMutationFn = Apollo.MutationFunction<
  CreateInitialUserMutation,
  CreateInitialUserMutationVariables
>;

/**
 * __useCreateInitialUserMutation__
 *
 * To run a mutation, you first call `useCreateInitialUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInitialUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInitialUserMutation, { data, loading, error }] = useCreateInitialUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCreateInitialUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateInitialUserMutation,
    CreateInitialUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateInitialUserMutation,
    CreateInitialUserMutationVariables
  >(CreateInitialUserDocument, options);
}
export type CreateInitialUserMutationHookResult = ReturnType<
  typeof useCreateInitialUserMutation
>;
export type CreateInitialUserMutationResult =
  Apollo.MutationResult<CreateInitialUserMutation>;
export type CreateInitialUserMutationOptions = Apollo.BaseMutationOptions<
  CreateInitialUserMutation,
  CreateInitialUserMutationVariables
>;
