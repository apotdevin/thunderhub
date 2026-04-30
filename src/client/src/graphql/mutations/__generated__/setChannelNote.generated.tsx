import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpsertChannelNoteMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']['input'];
  note: Types.Scalars['String']['input'];
}>;

export type UpsertChannelNoteMutation = {
  __typename?: 'Mutation';
  user: {
    __typename?: 'UserMutations';
    offchain: {
      __typename?: 'OffchainMutations';
      channels: {
        __typename?: 'ChannelsMutations';
        upsert_note: {
          __typename?: 'ChannelMetadata';
          channel_id: string;
          note: string;
          updated_at: string;
        };
      };
    };
  };
};

export type DeleteChannelNoteMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']['input'];
}>;

export type DeleteChannelNoteMutation = {
  __typename?: 'Mutation';
  user: {
    __typename?: 'UserMutations';
    offchain: {
      __typename?: 'OffchainMutations';
      channels: { __typename?: 'ChannelsMutations'; delete_note: boolean };
    };
  };
};

export const UpsertChannelNoteDocument = gql`
  mutation UpsertChannelNote($channelId: String!, $note: String!) {
    user {
      offchain {
        channels {
          upsert_note(channelId: $channelId, note: $note) {
            channel_id
            note
            updated_at
          }
        }
      }
    }
  }
`;
export type UpsertChannelNoteMutationFn = Apollo.MutationFunction<
  UpsertChannelNoteMutation,
  UpsertChannelNoteMutationVariables
>;

/**
 * __useUpsertChannelNoteMutation__
 *
 * To run a mutation, you first call `useUpsertChannelNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertChannelNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertChannelNoteMutation, { data, loading, error }] = useUpsertChannelNoteMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      note: // value for 'note'
 *   },
 * });
 */
export function useUpsertChannelNoteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpsertChannelNoteMutation,
    UpsertChannelNoteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpsertChannelNoteMutation,
    UpsertChannelNoteMutationVariables
  >(UpsertChannelNoteDocument, options);
}
export type UpsertChannelNoteMutationHookResult = ReturnType<
  typeof useUpsertChannelNoteMutation
>;
export type UpsertChannelNoteMutationResult =
  Apollo.MutationResult<UpsertChannelNoteMutation>;
export type UpsertChannelNoteMutationOptions = Apollo.BaseMutationOptions<
  UpsertChannelNoteMutation,
  UpsertChannelNoteMutationVariables
>;
export const DeleteChannelNoteDocument = gql`
  mutation DeleteChannelNote($channelId: String!) {
    user {
      offchain {
        channels {
          delete_note(channelId: $channelId)
        }
      }
    }
  }
`;
export type DeleteChannelNoteMutationFn = Apollo.MutationFunction<
  DeleteChannelNoteMutation,
  DeleteChannelNoteMutationVariables
>;

/**
 * __useDeleteChannelNoteMutation__
 *
 * To run a mutation, you first call `useDeleteChannelNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChannelNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChannelNoteMutation, { data, loading, error }] = useDeleteChannelNoteMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useDeleteChannelNoteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteChannelNoteMutation,
    DeleteChannelNoteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteChannelNoteMutation,
    DeleteChannelNoteMutationVariables
  >(DeleteChannelNoteDocument, options);
}
export type DeleteChannelNoteMutationHookResult = ReturnType<
  typeof useDeleteChannelNoteMutation
>;
export type DeleteChannelNoteMutationResult =
  Apollo.MutationResult<DeleteChannelNoteMutation>;
export type DeleteChannelNoteMutationOptions = Apollo.BaseMutationOptions<
  DeleteChannelNoteMutation,
  DeleteChannelNoteMutationVariables
>;
