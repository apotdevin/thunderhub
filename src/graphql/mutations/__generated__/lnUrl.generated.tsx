/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type FetchLnUrlMutationVariables = Types.Exact<{
  url: Types.Scalars['String'];
}>;


export type FetchLnUrlMutation = (
  { __typename?: 'Mutation' }
  & { fetchLnUrl?: Types.Maybe<(
    { __typename?: 'WithdrawRequest' }
    & Pick<Types.WithdrawRequest, 'callback' | 'k1' | 'maxWithdrawable' | 'defaultDescription' | 'minWithdrawable' | 'tag'>
  ) | (
    { __typename?: 'PayRequest' }
    & Pick<Types.PayRequest, 'callback' | 'maxSendable' | 'minSendable' | 'metadata' | 'commentAllowed' | 'tag'>
  )> }
);

export type PayLnUrlMutationVariables = Types.Exact<{
  callback: Types.Scalars['String'];
  amount: Types.Scalars['Int'];
  comment?: Types.Maybe<Types.Scalars['String']>;
}>;


export type PayLnUrlMutation = (
  { __typename?: 'Mutation' }
  & { lnUrlPay: (
    { __typename?: 'PaySuccess' }
    & Pick<Types.PaySuccess, 'tag' | 'description' | 'url' | 'message' | 'ciphertext' | 'iv'>
  ) }
);

export type WithdrawLnUrlMutationVariables = Types.Exact<{
  callback: Types.Scalars['String'];
  amount: Types.Scalars['Int'];
  k1: Types.Scalars['String'];
  description?: Types.Maybe<Types.Scalars['String']>;
}>;


export type WithdrawLnUrlMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'lnUrlWithdraw'>
);


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
        return Apollo.useMutation<FetchLnUrlMutation, FetchLnUrlMutationVariables>(FetchLnUrlDocument, baseOptions);
      }
export type FetchLnUrlMutationHookResult = ReturnType<typeof useFetchLnUrlMutation>;
export type FetchLnUrlMutationResult = Apollo.MutationResult<FetchLnUrlMutation>;
export type FetchLnUrlMutationOptions = Apollo.BaseMutationOptions<FetchLnUrlMutation, FetchLnUrlMutationVariables>;
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
        return Apollo.useMutation<PayLnUrlMutation, PayLnUrlMutationVariables>(PayLnUrlDocument, baseOptions);
      }
export type PayLnUrlMutationHookResult = ReturnType<typeof usePayLnUrlMutation>;
export type PayLnUrlMutationResult = Apollo.MutationResult<PayLnUrlMutation>;
export type PayLnUrlMutationOptions = Apollo.BaseMutationOptions<PayLnUrlMutation, PayLnUrlMutationVariables>;
export const WithdrawLnUrlDocument = gql`
    mutation WithdrawLnUrl($callback: String!, $amount: Int!, $k1: String!, $description: String) {
  lnUrlWithdraw(callback: $callback, amount: $amount, k1: $k1, description: $description)
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
        return Apollo.useMutation<WithdrawLnUrlMutation, WithdrawLnUrlMutationVariables>(WithdrawLnUrlDocument, baseOptions);
      }
export type WithdrawLnUrlMutationHookResult = ReturnType<typeof useWithdrawLnUrlMutation>;
export type WithdrawLnUrlMutationResult = Apollo.MutationResult<WithdrawLnUrlMutation>;
export type WithdrawLnUrlMutationOptions = Apollo.BaseMutationOptions<WithdrawLnUrlMutation, WithdrawLnUrlMutationVariables>;