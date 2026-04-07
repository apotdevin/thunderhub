import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PayMutationVariables = Types.Exact<{
  max_fee: Types.Scalars['Float'];
  max_paths: Types.Scalars['Float'];
  out?: Types.InputMaybe<
    Array<Types.Scalars['String']> | Types.Scalars['String']
  >;
  request: Types.Scalars['String'];
}>;

export type PayMutation = {
  __typename?: 'Mutation';
  pay: {
    __typename?: 'PayInvoice';
    fee: number;
    fee_mtokens: string;
    hops: {
      __typename?: 'Hops';
      channel: string;
      channel_capacity: number;
      fee_mtokens: string;
      forward_mtokens: string;
      timeout: number;
    }[];
    id: string;
    is_confirmed: boolean;
    is_outgoing: boolean;
    mtokens: string;
    safe_fee: number;
    safe_tokens: number;
    secret: string;
    tokens: number;
  };
};

export const PayDocument = gql`
  mutation Pay(
    $max_fee: Float!
    $max_paths: Float!
    $out: [String!]
    $request: String!
  ) {
    pay(
      max_fee: $max_fee
      max_paths: $max_paths
      out: $out
      request: $request
    ) {
      fee
      fee_mtokens
      hops {
        channel
        channel_capacity
        fee_mtokens
        forward_mtokens
        timeout
      }
      id
      is_confirmed
      is_outgoing
      mtokens
      safe_fee
      safe_tokens
      secret
      tokens
    }
  }
`;
export type PayMutationFn = Apollo.MutationFunction<
  PayMutation,
  PayMutationVariables
>;

/**
 * __usePayMutation__
 *
 * To run a mutation, you first call `usePayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payMutation, { data, loading, error }] = usePayMutation({
 *   variables: {
 *      max_fee: // value for 'max_fee'
 *      max_paths: // value for 'max_paths'
 *      out: // value for 'out'
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePayMutation(
  baseOptions?: Apollo.MutationHookOptions<PayMutation, PayMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PayMutation, PayMutationVariables>(
    PayDocument,
    options
  );
}
export type PayMutationHookResult = ReturnType<typeof usePayMutation>;
export type PayMutationResult = Apollo.MutationResult<PayMutation>;
export type PayMutationOptions = Apollo.BaseMutationOptions<
  PayMutation,
  PayMutationVariables
>;
