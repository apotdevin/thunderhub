/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateInvoiceMutationVariables = Types.Exact<{
  amount: Types.Scalars['Int'];
  description?: Types.Maybe<Types.Scalars['String']>;
  secondsUntil?: Types.Maybe<Types.Scalars['Int']>;
  includePrivate?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', createInvoice?: { __typename?: 'newInvoiceType', request: string, id: string } | null | undefined };


export const CreateInvoiceDocument = gql`
    mutation CreateInvoice($amount: Int!, $description: String, $secondsUntil: Int, $includePrivate: Boolean) {
  createInvoice(
    amount: $amount
    description: $description
    secondsUntil: $secondsUntil
    includePrivate: $includePrivate
  ) {
    request
    id
  }
}
    `;
export type CreateInvoiceMutationFn = Apollo.MutationFunction<CreateInvoiceMutation, CreateInvoiceMutationVariables>;

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
 *      description: // value for 'description'
 *      secondsUntil: // value for 'secondsUntil'
 *      includePrivate: // value for 'includePrivate'
 *   },
 * });
 */
export function useCreateInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, options);
      }
export type CreateInvoiceMutationHookResult = ReturnType<typeof useCreateInvoiceMutation>;
export type CreateInvoiceMutationResult = Apollo.MutationResult<CreateInvoiceMutation>;
export type CreateInvoiceMutationOptions = Apollo.BaseMutationOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>;