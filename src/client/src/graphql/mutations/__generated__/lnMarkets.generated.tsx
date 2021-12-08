import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type LnMarketsLoginMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LnMarketsLoginMutation = {
  __typename?: 'Mutation';
  lnMarketsLogin: {
    __typename?: 'AuthResponse';
    status: string;
    message: string;
  };
};

export type LnMarketsWithdrawMutationVariables = Types.Exact<{
  amount: Types.Scalars['Float'];
}>;

export type LnMarketsWithdrawMutation = {
  __typename?: 'Mutation';
  lnMarketsWithdraw: boolean;
};

export type LnMarketsDepositMutationVariables = Types.Exact<{
  amount: Types.Scalars['Float'];
}>;

export type LnMarketsDepositMutation = {
  __typename?: 'Mutation';
  lnMarketsDeposit: boolean;
};

export type LnMarketsLogoutMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LnMarketsLogoutMutation = {
  __typename?: 'Mutation';
  lnMarketsLogout: boolean;
};

export const LnMarketsLoginDocument = gql`
  mutation LnMarketsLogin {
    lnMarketsLogin {
      status
      message
    }
  }
`;
export type LnMarketsLoginMutationFn = Apollo.MutationFunction<
  LnMarketsLoginMutation,
  LnMarketsLoginMutationVariables
>;

/**
 * __useLnMarketsLoginMutation__
 *
 * To run a mutation, you first call `useLnMarketsLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLnMarketsLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lnMarketsLoginMutation, { data, loading, error }] = useLnMarketsLoginMutation({
 *   variables: {
 *   },
 * });
 */
export function useLnMarketsLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LnMarketsLoginMutation,
    LnMarketsLoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LnMarketsLoginMutation,
    LnMarketsLoginMutationVariables
  >(LnMarketsLoginDocument, options);
}
export type LnMarketsLoginMutationHookResult = ReturnType<
  typeof useLnMarketsLoginMutation
>;
export type LnMarketsLoginMutationResult =
  Apollo.MutationResult<LnMarketsLoginMutation>;
export type LnMarketsLoginMutationOptions = Apollo.BaseMutationOptions<
  LnMarketsLoginMutation,
  LnMarketsLoginMutationVariables
>;
export const LnMarketsWithdrawDocument = gql`
  mutation LnMarketsWithdraw($amount: Float!) {
    lnMarketsWithdraw(amount: $amount)
  }
`;
export type LnMarketsWithdrawMutationFn = Apollo.MutationFunction<
  LnMarketsWithdrawMutation,
  LnMarketsWithdrawMutationVariables
>;

/**
 * __useLnMarketsWithdrawMutation__
 *
 * To run a mutation, you first call `useLnMarketsWithdrawMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLnMarketsWithdrawMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lnMarketsWithdrawMutation, { data, loading, error }] = useLnMarketsWithdrawMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useLnMarketsWithdrawMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LnMarketsWithdrawMutation,
    LnMarketsWithdrawMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LnMarketsWithdrawMutation,
    LnMarketsWithdrawMutationVariables
  >(LnMarketsWithdrawDocument, options);
}
export type LnMarketsWithdrawMutationHookResult = ReturnType<
  typeof useLnMarketsWithdrawMutation
>;
export type LnMarketsWithdrawMutationResult =
  Apollo.MutationResult<LnMarketsWithdrawMutation>;
export type LnMarketsWithdrawMutationOptions = Apollo.BaseMutationOptions<
  LnMarketsWithdrawMutation,
  LnMarketsWithdrawMutationVariables
>;
export const LnMarketsDepositDocument = gql`
  mutation LnMarketsDeposit($amount: Float!) {
    lnMarketsDeposit(amount: $amount)
  }
`;
export type LnMarketsDepositMutationFn = Apollo.MutationFunction<
  LnMarketsDepositMutation,
  LnMarketsDepositMutationVariables
>;

/**
 * __useLnMarketsDepositMutation__
 *
 * To run a mutation, you first call `useLnMarketsDepositMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLnMarketsDepositMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lnMarketsDepositMutation, { data, loading, error }] = useLnMarketsDepositMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useLnMarketsDepositMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LnMarketsDepositMutation,
    LnMarketsDepositMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LnMarketsDepositMutation,
    LnMarketsDepositMutationVariables
  >(LnMarketsDepositDocument, options);
}
export type LnMarketsDepositMutationHookResult = ReturnType<
  typeof useLnMarketsDepositMutation
>;
export type LnMarketsDepositMutationResult =
  Apollo.MutationResult<LnMarketsDepositMutation>;
export type LnMarketsDepositMutationOptions = Apollo.BaseMutationOptions<
  LnMarketsDepositMutation,
  LnMarketsDepositMutationVariables
>;
export const LnMarketsLogoutDocument = gql`
  mutation LnMarketsLogout {
    lnMarketsLogout
  }
`;
export type LnMarketsLogoutMutationFn = Apollo.MutationFunction<
  LnMarketsLogoutMutation,
  LnMarketsLogoutMutationVariables
>;

/**
 * __useLnMarketsLogoutMutation__
 *
 * To run a mutation, you first call `useLnMarketsLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLnMarketsLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lnMarketsLogoutMutation, { data, loading, error }] = useLnMarketsLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLnMarketsLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LnMarketsLogoutMutation,
    LnMarketsLogoutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LnMarketsLogoutMutation,
    LnMarketsLogoutMutationVariables
  >(LnMarketsLogoutDocument, options);
}
export type LnMarketsLogoutMutationHookResult = ReturnType<
  typeof useLnMarketsLogoutMutation
>;
export type LnMarketsLogoutMutationResult =
  Apollo.MutationResult<LnMarketsLogoutMutation>;
export type LnMarketsLogoutMutationOptions = Apollo.BaseMutationOptions<
  LnMarketsLogoutMutation,
  LnMarketsLogoutMutationVariables
>;
