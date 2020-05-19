import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type CreateInvoiceMutationVariables = {
  amount: Types.Scalars['Int'];
  auth: Types.AuthType;
};

export type CreateInvoiceMutation = { __typename?: 'Mutation' } & {
  createInvoice?: Types.Maybe<
    { __typename?: 'invoiceType' } & Pick<Types.InvoiceType, 'request'>
  >;
};

export const CreateInvoiceDocument = gql`
  mutation CreateInvoice($amount: Int!, $auth: authType!) {
    createInvoice(amount: $amount, auth: $auth) {
      request
    }
  }
`;
export type CreateInvoiceMutationFn = ApolloReactCommon.MutationFunction<
  CreateInvoiceMutation,
  CreateInvoiceMutationVariables
>;

/**
 * __useCreateInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvoiceMutation, { data, loading, error }] = useCreateInvoiceMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useCreateInvoiceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateInvoiceMutation,
    CreateInvoiceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateInvoiceMutation,
    CreateInvoiceMutationVariables
  >(CreateInvoiceDocument, baseOptions);
}
export type CreateInvoiceMutationHookResult = ReturnType<
  typeof useCreateInvoiceMutation
>;
export type CreateInvoiceMutationResult = ApolloReactCommon.MutationResult<
  CreateInvoiceMutation
>;
export type CreateInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateInvoiceMutation,
  CreateInvoiceMutationVariables
>;
