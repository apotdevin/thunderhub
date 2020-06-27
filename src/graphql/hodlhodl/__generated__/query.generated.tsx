import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetCountriesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetCountriesQuery = { __typename?: 'Query' } & {
  getCountries?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'hodlCountryType' } & Pick<
          Types.HodlCountryType,
          'code' | 'name' | 'native_name' | 'currency_code' | 'currency_name'
        >
      >
    >
  >;
};

export type GetCurrenciesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetCurrenciesQuery = { __typename?: 'Query' } & {
  getCurrencies?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'hodlCurrencyType' } & Pick<
          Types.HodlCurrencyType,
          'code' | 'name' | 'type'
        >
      >
    >
  >;
};

export type GetOffersQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.Scalars['String']>;
}>;

export type GetOffersQuery = { __typename?: 'Query' } & {
  getOffers?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'hodlOfferType' } & Pick<
          Types.HodlOfferType,
          | 'id'
          | 'asset_code'
          | 'country'
          | 'country_code'
          | 'working_now'
          | 'side'
          | 'title'
          | 'description'
          | 'currency_code'
          | 'price'
          | 'min_amount'
          | 'max_amount'
          | 'first_trade_limit'
          | 'balance'
          | 'payment_window_minutes'
          | 'confirmations'
        > & {
            fee?: Types.Maybe<
              { __typename?: 'hodlOfferFeeType' } & Pick<
                Types.HodlOfferFeeType,
                'author_fee_rate'
              >
            >;
            payment_method_instructions?: Types.Maybe<
              Array<
                Types.Maybe<
                  { __typename?: 'hodlOfferPaymentType' } & Pick<
                    Types.HodlOfferPaymentType,
                    | 'id'
                    | 'version'
                    | 'payment_method_id'
                    | 'payment_method_type'
                    | 'payment_method_name'
                  >
                >
              >
            >;
            trader?: Types.Maybe<
              { __typename?: 'hodlOfferTraderType' } & Pick<
                Types.HodlOfferTraderType,
                | 'login'
                | 'online_status'
                | 'rating'
                | 'trades_count'
                | 'url'
                | 'verified'
                | 'verified_by'
                | 'strong_hodler'
                | 'country'
                | 'country_code'
                | 'average_payment_time_minutes'
                | 'average_release_time_minutes'
                | 'days_since_last_trade'
              >
            >;
          }
      >
    >
  >;
};

export const GetCountriesDocument = gql`
  query GetCountries {
    getCountries {
      code
      name
      native_name
      currency_code
      currency_name
    }
  }
`;

/**
 * __useGetCountriesQuery__
 *
 * To run a query within a React component, call `useGetCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCountriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCountriesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCountriesQuery,
    GetCountriesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetCountriesQuery,
    GetCountriesQueryVariables
  >(GetCountriesDocument, baseOptions);
}
export function useGetCountriesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCountriesQuery,
    GetCountriesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetCountriesQuery,
    GetCountriesQueryVariables
  >(GetCountriesDocument, baseOptions);
}
export type GetCountriesQueryHookResult = ReturnType<
  typeof useGetCountriesQuery
>;
export type GetCountriesLazyQueryHookResult = ReturnType<
  typeof useGetCountriesLazyQuery
>;
export type GetCountriesQueryResult = ApolloReactCommon.QueryResult<
  GetCountriesQuery,
  GetCountriesQueryVariables
>;
export const GetCurrenciesDocument = gql`
  query GetCurrencies {
    getCurrencies {
      code
      name
      type
    }
  }
`;

/**
 * __useGetCurrenciesQuery__
 *
 * To run a query within a React component, call `useGetCurrenciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrenciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrenciesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrenciesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables
  >(GetCurrenciesDocument, baseOptions);
}
export function useGetCurrenciesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables
  >(GetCurrenciesDocument, baseOptions);
}
export type GetCurrenciesQueryHookResult = ReturnType<
  typeof useGetCurrenciesQuery
>;
export type GetCurrenciesLazyQueryHookResult = ReturnType<
  typeof useGetCurrenciesLazyQuery
>;
export type GetCurrenciesQueryResult = ApolloReactCommon.QueryResult<
  GetCurrenciesQuery,
  GetCurrenciesQueryVariables
>;
export const GetOffersDocument = gql`
  query GetOffers($filter: String) {
    getOffers(filter: $filter) {
      id
      asset_code
      country
      country_code
      working_now
      side
      title
      description
      currency_code
      price
      min_amount
      max_amount
      first_trade_limit
      fee {
        author_fee_rate
      }
      balance
      payment_window_minutes
      confirmations
      payment_method_instructions {
        id
        version
        payment_method_id
        payment_method_type
        payment_method_name
      }
      trader {
        login
        online_status
        rating
        trades_count
        url
        verified
        verified_by
        strong_hodler
        country
        country_code
        average_payment_time_minutes
        average_release_time_minutes
        days_since_last_trade
      }
    }
  }
`;

/**
 * __useGetOffersQuery__
 *
 * To run a query within a React component, call `useGetOffersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOffersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOffersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetOffersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetOffersQuery,
    GetOffersQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetOffersQuery, GetOffersQueryVariables>(
    GetOffersDocument,
    baseOptions
  );
}
export function useGetOffersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetOffersQuery,
    GetOffersQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetOffersQuery, GetOffersQueryVariables>(
    GetOffersDocument,
    baseOptions
  );
}
export type GetOffersQueryHookResult = ReturnType<typeof useGetOffersQuery>;
export type GetOffersLazyQueryHookResult = ReturnType<
  typeof useGetOffersLazyQuery
>;
export type GetOffersQueryResult = ApolloReactCommon.QueryResult<
  GetOffersQuery,
  GetOffersQueryVariables
>;
