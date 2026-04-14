import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BakeSuperMacaroonMutationVariables = Types.Exact<{
  input: Types.BakeSuperMacaroonInput;
}>;

export type BakeSuperMacaroonMutation = {
  __typename?: 'Mutation';
  bakeSuperMacaroon: {
    __typename?: 'SuperMacaroon';
    base: string;
    hex: string;
  };
};

export const BakeSuperMacaroonDocument = gql`
  mutation BakeSuperMacaroon($input: BakeSuperMacaroonInput!) {
    bakeSuperMacaroon(input: $input) {
      base
      hex
    }
  }
`;
export type BakeSuperMacaroonMutationFn = Apollo.MutationFunction<
  BakeSuperMacaroonMutation,
  BakeSuperMacaroonMutationVariables
>;

/**
 * __useBakeSuperMacaroonMutation__
 *
 * To run a mutation, you first call `useBakeSuperMacaroonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBakeSuperMacaroonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bakeSuperMacaroonMutation, { data, loading, error }] = useBakeSuperMacaroonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBakeSuperMacaroonMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BakeSuperMacaroonMutation,
    BakeSuperMacaroonMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BakeSuperMacaroonMutation,
    BakeSuperMacaroonMutationVariables
  >(BakeSuperMacaroonDocument, options);
}
export type BakeSuperMacaroonMutationHookResult = ReturnType<
  typeof useBakeSuperMacaroonMutation
>;
export type BakeSuperMacaroonMutationResult =
  Apollo.MutationResult<BakeSuperMacaroonMutation>;
export type BakeSuperMacaroonMutationOptions = Apollo.BaseMutationOptions<
  BakeSuperMacaroonMutation,
  BakeSuperMacaroonMutationVariables
>;
