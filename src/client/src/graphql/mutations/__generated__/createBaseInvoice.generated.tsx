import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type CreateBaseInvoiceMutationVariables = Types.Exact<{
  amount: Types.Scalars['Float'];
}>;

export type CreateBaseInvoiceMutation = {
  __typename?: 'Mutation';
  createBaseInvoice: {
    __typename?: 'BaseInvoice';
    request: string;
    id: string;
  };
};

export const CreateBaseInvoiceDocument = gql`
  mutation CreateBaseInvoice($amount: Float!) {
    createBaseInvoice(amount: $amount) {
      request
      id
    }
  }
`;
export type CreateBaseInvoiceMutationFn = Apollo.MutationFunction<
  CreateBaseInvoiceMutation,
  CreateBaseInvoiceMutationVariables
>;

/**
 * __useCreateBaseInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateBaseInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBaseInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBaseInvoiceMutation, { data, loading, error }] = useCreateBaseInvoiceMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useCreateBaseInvoiceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateBaseInvoiceMutation,
    CreateBaseInvoiceMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateBaseInvoiceMutation,
    CreateBaseInvoiceMutationVariables
  >(CreateBaseInvoiceDocument, options);
}
export type CreateBaseInvoiceMutationHookResult = ReturnType<
  typeof useCreateBaseInvoiceMutation
>;
export type CreateBaseInvoiceMutationResult =
  Apollo.MutationResult<CreateBaseInvoiceMutation>;
export type CreateBaseInvoiceMutationOptions = Apollo.BaseMutationOptions<
  CreateBaseInvoiceMutation,
  CreateBaseInvoiceMutationVariables
>;
