import {
  gql,
  MutationFunction,
  useMutation,
  MutationHookOptions,
  BaseMutationOptions,
  MutationResult,
} from '@apollo/client';
import * as Types from '../../types';

export type CreateInvoiceMutationVariables = Types.Exact<{
  amount: Types.Scalars['Int'];
}>;

export type CreateInvoiceMutation = { __typename?: 'Mutation' } & {
  createInvoice?: Types.Maybe<
    { __typename?: 'newInvoiceType' } & Pick<Types.NewInvoiceType, 'request'>
  >;
};

export const CreateInvoiceDocument = gql`
  mutation CreateInvoice($amount: Int!) {
    createInvoice(amount: $amount) {
      request
    }
  }
`;
export type CreateInvoiceMutationFn = MutationFunction<
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
 *   },
 * });
 */
export function useCreateInvoiceMutation(
  baseOptions?: MutationHookOptions<
    CreateInvoiceMutation,
    CreateInvoiceMutationVariables
  >
) {
  return useMutation<CreateInvoiceMutation, CreateInvoiceMutationVariables>(
    CreateInvoiceDocument,
    baseOptions
  );
}
export type CreateInvoiceMutationHookResult = ReturnType<
  typeof useCreateInvoiceMutation
>;
export type CreateInvoiceMutationResult = MutationResult<CreateInvoiceMutation>;
export type CreateInvoiceMutationOptions = BaseMutationOptions<
  CreateInvoiceMutation,
  CreateInvoiceMutationVariables
>;
