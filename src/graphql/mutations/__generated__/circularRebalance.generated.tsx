import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type CircularRebalanceMutationVariables = {
  auth: Types.AuthType;
  route: Types.Scalars['String'];
};

export type CircularRebalanceMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'circularRebalance'
>;

export const CircularRebalanceDocument = gql`
  mutation CircularRebalance($auth: authType!, $route: String!) {
    circularRebalance(auth: $auth, route: $route)
  }
`;
export type CircularRebalanceMutationFn = ApolloReactCommon.MutationFunction<
  CircularRebalanceMutation,
  CircularRebalanceMutationVariables
>;

/**
 * __useCircularRebalanceMutation__
 *
 * To run a mutation, you first call `useCircularRebalanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCircularRebalanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [circularRebalanceMutation, { data, loading, error }] = useCircularRebalanceMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      route: // value for 'route'
 *   },
 * });
 */
export function useCircularRebalanceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CircularRebalanceMutation,
    CircularRebalanceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CircularRebalanceMutation,
    CircularRebalanceMutationVariables
  >(CircularRebalanceDocument, baseOptions);
}
export type CircularRebalanceMutationHookResult = ReturnType<
  typeof useCircularRebalanceMutation
>;
export type CircularRebalanceMutationResult = ApolloReactCommon.MutationResult<
  CircularRebalanceMutation
>;
export type CircularRebalanceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CircularRebalanceMutation,
  CircularRebalanceMutationVariables
>;
