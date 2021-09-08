/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateBaseTokenInvoiceMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateBaseTokenInvoiceMutation = { __typename?: 'Mutation', createBaseTokenInvoice?: Types.Maybe<{ __typename?: 'baseInvoiceType', request: string, id: string }> };


export const CreateBaseTokenInvoiceDocument = gql`
    mutation CreateBaseTokenInvoice {
  createBaseTokenInvoice {
    request
    id
  }
}
    `;
export type CreateBaseTokenInvoiceMutationFn = Apollo.MutationFunction<CreateBaseTokenInvoiceMutation, CreateBaseTokenInvoiceMutationVariables>;

/**
 * __useCreateBaseTokenInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateBaseTokenInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBaseTokenInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBaseTokenInvoiceMutation, { data, loading, error }] = useCreateBaseTokenInvoiceMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateBaseTokenInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateBaseTokenInvoiceMutation, CreateBaseTokenInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBaseTokenInvoiceMutation, CreateBaseTokenInvoiceMutationVariables>(CreateBaseTokenInvoiceDocument, options);
      }
export type CreateBaseTokenInvoiceMutationHookResult = ReturnType<typeof useCreateBaseTokenInvoiceMutation>;
export type CreateBaseTokenInvoiceMutationResult = Apollo.MutationResult<CreateBaseTokenInvoiceMutation>;
export type CreateBaseTokenInvoiceMutationOptions = Apollo.BaseMutationOptions<CreateBaseTokenInvoiceMutation, CreateBaseTokenInvoiceMutationVariables>;