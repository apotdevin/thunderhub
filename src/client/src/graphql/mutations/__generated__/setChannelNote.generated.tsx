import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SetChannelNoteMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']['input'];
  note: Types.Scalars['String']['input'];
}>;

export type SetChannelNoteMutation = {
  __typename?: 'Mutation';
  setChannelNote: {
    __typename?: 'ChannelNote';
    channelId: string;
    note: string;
    updatedAt: string;
  };
};

export const SetChannelNoteDocument = gql`
  mutation SetChannelNote($channelId: String!, $note: String!) {
    setChannelNote(channelId: $channelId, note: $note) {
      channelId
      note
      updatedAt
    }
  }
`;
export type SetChannelNoteMutationFn = Apollo.MutationFunction<
  SetChannelNoteMutation,
  SetChannelNoteMutationVariables
>;

/**
 * __useSetChannelNoteMutation__
 *
 * To run a mutation, you first call `useSetChannelNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetChannelNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setChannelNoteMutation, { data, loading, error }] = useSetChannelNoteMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      note: // value for 'note'
 *   },
 * });
 */
export function useSetChannelNoteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetChannelNoteMutation,
    SetChannelNoteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SetChannelNoteMutation,
    SetChannelNoteMutationVariables
  >(SetChannelNoteDocument, options);
}
export type SetChannelNoteMutationHookResult = ReturnType<
  typeof useSetChannelNoteMutation
>;
export type SetChannelNoteMutationResult =
  Apollo.MutationResult<SetChannelNoteMutation>;
export type SetChannelNoteMutationOptions = Apollo.BaseMutationOptions<
  SetChannelNoteMutation,
  SetChannelNoteMutationVariables
>;
