/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SendMessageMutationVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  message: Types.Scalars['String'];
  messageType?: Types.Maybe<Types.Scalars['String']>;
  tokens?: Types.Maybe<Types.Scalars['Int']>;
  maxFee?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage?: number | null | undefined };


export const SendMessageDocument = gql`
    mutation SendMessage($publicKey: String!, $message: String!, $messageType: String, $tokens: Int, $maxFee: Int) {
  sendMessage(
    publicKey: $publicKey
    message: $message
    messageType: $messageType
    tokens: $tokens
    maxFee: $maxFee
  )
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *      message: // value for 'message'
 *      messageType: // value for 'messageType'
 *      tokens: // value for 'tokens'
 *      maxFee: // value for 'maxFee'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;