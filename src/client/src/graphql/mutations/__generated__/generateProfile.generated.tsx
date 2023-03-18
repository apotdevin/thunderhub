import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EventMutationVariables = Types.Exact<{
  privateKey: Types.Scalars['String'];
}>;

export type EventMutation = {
  __typename?: 'Mutation';
  generateProfile: {
    __typename?: 'Event';
    kind: number;
    tags: Array<Array<string>>;
    content: string;
    created_at: number;
    pubkey: string;
    id: string;
    sig: string;
  };
};

export const EventDocument = gql`
  mutation Event($privateKey: String!) {
    generateProfile(privateKey: $privateKey) {
      kind
      tags
      content
      created_at
      pubkey
      id
      sig
    }
  }
`;
export type EventMutationFn = Apollo.MutationFunction<
  EventMutation,
  EventMutationVariables
>;

/**
 * __useEventMutation__
 *
 * To run a mutation, you first call `useEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [eventMutation, { data, loading, error }] = useEventMutation({
 *   variables: {
 *      privateKey: // value for 'privateKey'
 *   },
 * });
 */
export function useEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    EventMutation,
    EventMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<EventMutation, EventMutationVariables>(
    EventDocument,
    options
  );
}
export type EventMutationHookResult = ReturnType<typeof useEventMutation>;
export type EventMutationResult = Apollo.MutationResult<EventMutation>;
export type EventMutationOptions = Apollo.BaseMutationOptions<
  EventMutation,
  EventMutationVariables
>;
