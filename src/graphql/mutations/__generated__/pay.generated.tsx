import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type PayInvoiceMutationVariables = {
  request: Types.Scalars['String'];
  auth: Types.AuthType;
  tokens?: Types.Maybe<Types.Scalars['Int']>;
};

export type PayInvoiceMutation = { __typename?: 'Mutation' } & {
  pay?: Types.Maybe<
    { __typename?: 'payType' } & Pick<Types.PayType, 'is_confirmed'>
  >;
};

export const PayInvoiceDocument = gql`
  mutation PayInvoice($request: String!, $auth: authType!, $tokens: Int) {
    pay(request: $request, auth: $auth, tokens: $tokens) {
      is_confirmed
    }
  }
`;
export type PayInvoiceMutationFn = ApolloReactCommon.MutationFunction<
  PayInvoiceMutation,
  PayInvoiceMutationVariables
>;

/**
 * __usePayInvoiceMutation__
 *
 * To run a mutation, you first call `usePayInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payInvoiceMutation, { data, loading, error }] = usePayInvoiceMutation({
 *   variables: {
 *      request: // value for 'request'
 *      auth: // value for 'auth'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function usePayInvoiceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PayInvoiceMutation,
    PayInvoiceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PayInvoiceMutation,
    PayInvoiceMutationVariables
  >(PayInvoiceDocument, baseOptions);
}
export type PayInvoiceMutationHookResult = ReturnType<
  typeof usePayInvoiceMutation
>;
export type PayInvoiceMutationResult = ApolloReactCommon.MutationResult<
  PayInvoiceMutation
>;
export type PayInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PayInvoiceMutation,
  PayInvoiceMutationVariables
>;
