import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type UpdateFeesMutationVariables = {
  auth: Types.AuthType;
  transactionId?: Types.Maybe<Types.Scalars['String']>;
  transactionVout?: Types.Maybe<Types.Scalars['Int']>;
  baseFee?: Types.Maybe<Types.Scalars['Int']>;
  feeRate?: Types.Maybe<Types.Scalars['Int']>;
};

export type UpdateFeesMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'updateFees'
>;

export const UpdateFeesDocument = gql`
  mutation UpdateFees(
    $auth: authType!
    $transactionId: String
    $transactionVout: Int
    $baseFee: Int
    $feeRate: Int
  ) {
    updateFees(
      auth: $auth
      transactionId: $transactionId
      transactionVout: $transactionVout
      baseFee: $baseFee
      feeRate: $feeRate
    )
  }
`;
export type UpdateFeesMutationFn = ApolloReactCommon.MutationFunction<
  UpdateFeesMutation,
  UpdateFeesMutationVariables
>;

/**
 * __useUpdateFeesMutation__
 *
 * To run a mutation, you first call `useUpdateFeesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFeesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFeesMutation, { data, loading, error }] = useUpdateFeesMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      transactionId: // value for 'transactionId'
 *      transactionVout: // value for 'transactionVout'
 *      baseFee: // value for 'baseFee'
 *      feeRate: // value for 'feeRate'
 *   },
 * });
 */
export function useUpdateFeesMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateFeesMutation,
    UpdateFeesMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateFeesMutation,
    UpdateFeesMutationVariables
  >(UpdateFeesDocument, baseOptions);
}
export type UpdateFeesMutationHookResult = ReturnType<
  typeof useUpdateFeesMutation
>;
export type UpdateFeesMutationResult = ApolloReactCommon.MutationResult<
  UpdateFeesMutation
>;
export type UpdateFeesMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateFeesMutation,
  UpdateFeesMutationVariables
>;
