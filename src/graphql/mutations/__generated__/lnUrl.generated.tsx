/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type FetchLnUrlMutationVariables = Types.Exact<{
  url: Types.Scalars['String'];
}>;


export type FetchLnUrlMutation = { __typename?: 'Mutation', fetchLnUrl?: { __typename?: 'ChannelRequest', tag?: string | null | undefined, k1?: string | null | undefined, callback?: string | null | undefined, uri?: string | null | undefined } | { __typename?: 'PayRequest', callback?: string | null | undefined, maxSendable?: string | null | undefined, minSendable?: string | null | undefined, metadata?: string | null | undefined, commentAllowed?: number | null | undefined, tag?: string | null | undefined } | { __typename?: 'WithdrawRequest', callback?: string | null | undefined, k1?: string | null | undefined, maxWithdrawable?: string | null | undefined, defaultDescription?: string | null | undefined, minWithdrawable?: string | null | undefined, tag?: string | null | undefined } | null | undefined };

export type AuthLnUrlMutationVariables = Types.Exact<{
  url: Types.Scalars['String'];
}>;


export type AuthLnUrlMutation = { __typename?: 'Mutation', lnUrlAuth: { __typename?: 'AuthResponse', status: string, message: string } };

export type PayLnUrlMutationVariables = Types.Exact<{
  callback: Types.Scalars['String'];
  amount: Types.Scalars['Int'];
  comment?: Types.Maybe<Types.Scalars['String']>;
}>;


export type PayLnUrlMutation = { __typename?: 'Mutation', lnUrlPay: { __typename?: 'PaySuccess', tag?: string | null | undefined, description?: string | null | undefined, url?: string | null | undefined, message?: string | null | undefined, ciphertext?: string | null | undefined, iv?: string | null | undefined } };

export type WithdrawLnUrlMutationVariables = Types.Exact<{
  callback: Types.Scalars['String'];
  amount: Types.Scalars['Int'];
  k1: Types.Scalars['String'];
  description?: Types.Maybe<Types.Scalars['String']>;
}>;


export type WithdrawLnUrlMutation = { __typename?: 'Mutation', lnUrlWithdraw: string };

export type ChannelLnUrlMutationVariables = Types.Exact<{
  callback: Types.Scalars['String'];
  k1: Types.Scalars['String'];
  uri: Types.Scalars['String'];
}>;


export type ChannelLnUrlMutation = { __typename?: 'Mutation', lnUrlChannel: string };


export const FetchLnUrlDocument = gql`
    mutation FetchLnUrl($url: String!) {
  fetchLnUrl(url: $url) {
    ... on WithdrawRequest {
      callback
      k1
      maxWithdrawable
      defaultDescription
      minWithdrawable
      tag
    }
    ... on PayRequest {
      callback
      maxSendable
      minSendable
      metadata
      commentAllowed
      tag
    }
    ... on ChannelRequest {
      tag
      k1
      callback
      uri
    }
  }
}
    `;
export type FetchLnUrlMutationFn = Apollo.MutationFunction<FetchLnUrlMutation, FetchLnUrlMutationVariables>;

/**
 * __useFetchLnUrlMutation__
 *
 * To run a mutation, you first call `useFetchLnUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFetchLnUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fetchLnUrlMutation, { data, loading, error }] = useFetchLnUrlMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useFetchLnUrlMutation(baseOptions?: Apollo.MutationHookOptions<FetchLnUrlMutation, FetchLnUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FetchLnUrlMutation, FetchLnUrlMutationVariables>(FetchLnUrlDocument, options);
      }
export type FetchLnUrlMutationHookResult = ReturnType<typeof useFetchLnUrlMutation>;
export type FetchLnUrlMutationResult = Apollo.MutationResult<FetchLnUrlMutation>;
export type FetchLnUrlMutationOptions = Apollo.BaseMutationOptions<FetchLnUrlMutation, FetchLnUrlMutationVariables>;
export const AuthLnUrlDocument = gql`
    mutation AuthLnUrl($url: String!) {
  lnUrlAuth(url: $url) {
    status
    message
  }
}
    `;
export type AuthLnUrlMutationFn = Apollo.MutationFunction<AuthLnUrlMutation, AuthLnUrlMutationVariables>;

/**
 * __useAuthLnUrlMutation__
 *
 * To run a mutation, you first call `useAuthLnUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthLnUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authLnUrlMutation, { data, loading, error }] = useAuthLnUrlMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useAuthLnUrlMutation(baseOptions?: Apollo.MutationHookOptions<AuthLnUrlMutation, AuthLnUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AuthLnUrlMutation, AuthLnUrlMutationVariables>(AuthLnUrlDocument, options);
      }
export type AuthLnUrlMutationHookResult = ReturnType<typeof useAuthLnUrlMutation>;
export type AuthLnUrlMutationResult = Apollo.MutationResult<AuthLnUrlMutation>;
export type AuthLnUrlMutationOptions = Apollo.BaseMutationOptions<AuthLnUrlMutation, AuthLnUrlMutationVariables>;
export const PayLnUrlDocument = gql`
    mutation PayLnUrl($callback: String!, $amount: Int!, $comment: String) {
  lnUrlPay(callback: $callback, amount: $amount, comment: $comment) {
    tag
    description
    url
    message
    ciphertext
    iv
  }
}
    `;
export type PayLnUrlMutationFn = Apollo.MutationFunction<PayLnUrlMutation, PayLnUrlMutationVariables>;

/**
 * __usePayLnUrlMutation__
 *
 * To run a mutation, you first call `usePayLnUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayLnUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payLnUrlMutation, { data, loading, error }] = usePayLnUrlMutation({
 *   variables: {
 *      callback: // value for 'callback'
 *      amount: // value for 'amount'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function usePayLnUrlMutation(baseOptions?: Apollo.MutationHookOptions<PayLnUrlMutation, PayLnUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PayLnUrlMutation, PayLnUrlMutationVariables>(PayLnUrlDocument, options);
      }
export type PayLnUrlMutationHookResult = ReturnType<typeof usePayLnUrlMutation>;
export type PayLnUrlMutationResult = Apollo.MutationResult<PayLnUrlMutation>;
export type PayLnUrlMutationOptions = Apollo.BaseMutationOptions<PayLnUrlMutation, PayLnUrlMutationVariables>;
export const WithdrawLnUrlDocument = gql`
    mutation WithdrawLnUrl($callback: String!, $amount: Int!, $k1: String!, $description: String) {
  lnUrlWithdraw(
    callback: $callback
    amount: $amount
    k1: $k1
    description: $description
  )
}
    `;
export type WithdrawLnUrlMutationFn = Apollo.MutationFunction<WithdrawLnUrlMutation, WithdrawLnUrlMutationVariables>;

/**
 * __useWithdrawLnUrlMutation__
 *
 * To run a mutation, you first call `useWithdrawLnUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWithdrawLnUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [withdrawLnUrlMutation, { data, loading, error }] = useWithdrawLnUrlMutation({
 *   variables: {
 *      callback: // value for 'callback'
 *      amount: // value for 'amount'
 *      k1: // value for 'k1'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useWithdrawLnUrlMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawLnUrlMutation, WithdrawLnUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WithdrawLnUrlMutation, WithdrawLnUrlMutationVariables>(WithdrawLnUrlDocument, options);
      }
export type WithdrawLnUrlMutationHookResult = ReturnType<typeof useWithdrawLnUrlMutation>;
export type WithdrawLnUrlMutationResult = Apollo.MutationResult<WithdrawLnUrlMutation>;
export type WithdrawLnUrlMutationOptions = Apollo.BaseMutationOptions<WithdrawLnUrlMutation, WithdrawLnUrlMutationVariables>;
export const ChannelLnUrlDocument = gql`
    mutation ChannelLnUrl($callback: String!, $k1: String!, $uri: String!) {
  lnUrlChannel(callback: $callback, k1: $k1, uri: $uri)
}
    `;
export type ChannelLnUrlMutationFn = Apollo.MutationFunction<ChannelLnUrlMutation, ChannelLnUrlMutationVariables>;

/**
 * __useChannelLnUrlMutation__
 *
 * To run a mutation, you first call `useChannelLnUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelLnUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelLnUrlMutation, { data, loading, error }] = useChannelLnUrlMutation({
 *   variables: {
 *      callback: // value for 'callback'
 *      k1: // value for 'k1'
 *      uri: // value for 'uri'
 *   },
 * });
 */
export function useChannelLnUrlMutation(baseOptions?: Apollo.MutationHookOptions<ChannelLnUrlMutation, ChannelLnUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChannelLnUrlMutation, ChannelLnUrlMutationVariables>(ChannelLnUrlDocument, options);
      }
export type ChannelLnUrlMutationHookResult = ReturnType<typeof useChannelLnUrlMutation>;
export type ChannelLnUrlMutationResult = Apollo.MutationResult<ChannelLnUrlMutation>;
export type ChannelLnUrlMutationOptions = Apollo.BaseMutationOptions<ChannelLnUrlMutation, ChannelLnUrlMutationVariables>;