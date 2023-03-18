import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GenerateNostrProfileMutationVariables = Types.Exact<{
  privateKey: Types.Scalars['String'];
}>;

export type GenerateNostrProfileMutation = {
  __typename?: 'Mutation';
  generateNostrProfile: {
    __typename?: 'NostrGenerateProfile';
    profile: {
      __typename?: 'NostrEvent';
      kind: number;
      tags: Array<Array<string>>;
      content: string;
      created_at: number;
      pubkey: string;
      id: string;
      sig: string;
    };
    announcement: {
      __typename?: 'NostrEvent';
      kind: number;
      tags: Array<Array<string>>;
      content: string;
      created_at: number;
      pubkey: string;
      id: string;
      sig: string;
    };
  };
};

export const GenerateNostrProfileDocument = gql`
  mutation GenerateNostrProfile($privateKey: String!) {
    generateNostrProfile(privateKey: $privateKey) {
      profile {
        kind
        tags
        content
        created_at
        pubkey
        id
        sig
      }
      announcement {
        kind
        tags
        content
        created_at
        pubkey
        id
        sig
      }
    }
  }
`;
export type GenerateNostrProfileMutationFn = Apollo.MutationFunction<
  GenerateNostrProfileMutation,
  GenerateNostrProfileMutationVariables
>;

/**
 * __useGenerateNostrProfileMutation__
 *
 * To run a mutation, you first call `useGenerateNostrProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateNostrProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateNostrProfileMutation, { data, loading, error }] = useGenerateNostrProfileMutation({
 *   variables: {
 *      privateKey: // value for 'privateKey'
 *   },
 * });
 */
export function useGenerateNostrProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GenerateNostrProfileMutation,
    GenerateNostrProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GenerateNostrProfileMutation,
    GenerateNostrProfileMutationVariables
  >(GenerateNostrProfileDocument, options);
}
export type GenerateNostrProfileMutationHookResult = ReturnType<
  typeof useGenerateNostrProfileMutation
>;
export type GenerateNostrProfileMutationResult =
  Apollo.MutationResult<GenerateNostrProfileMutation>;
export type GenerateNostrProfileMutationOptions = Apollo.BaseMutationOptions<
  GenerateNostrProfileMutation,
  GenerateNostrProfileMutationVariables
>;
