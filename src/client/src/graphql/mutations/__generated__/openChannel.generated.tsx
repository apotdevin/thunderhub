import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OpenChannelMutationVariables = Types.Exact<{
  input: Types.OpenChannelParams;
}>;

export type OpenChannelMutation = {
  __typename?: 'Mutation';
  openChannel: {
    __typename?: 'OpenOrCloseChannel';
    transactionId: string;
    transactionOutputIndex: string;
  };
};

export const OpenChannelDocument = gql`
  mutation OpenChannel($input: OpenChannelParams!) {
    openChannel(input: $input) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type OpenChannelMutationFn = Apollo.MutationFunction<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;

/**
 * __useOpenChannelMutation__
 *
 * To run a mutation, you first call `useOpenChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOpenChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [openChannelMutation, { data, loading, error }] = useOpenChannelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOpenChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OpenChannelMutation,
    OpenChannelMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<OpenChannelMutation, OpenChannelMutationVariables>(
    OpenChannelDocument,
    options
  );
}
export type OpenChannelMutationHookResult = ReturnType<
  typeof useOpenChannelMutation
>;
export type OpenChannelMutationResult =
  Apollo.MutationResult<OpenChannelMutation>;
export type OpenChannelMutationOptions = Apollo.BaseMutationOptions<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;
