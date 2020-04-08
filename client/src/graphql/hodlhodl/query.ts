import gql from 'graphql-tag';

export const GET_HODL_COUNTRIES = gql`
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

export const GET_HODL_CURRENCIES = gql`
    query GetCurrencies {
        getCurrencies {
            code
            name
            type
        }
    }
`;

export const GET_HODL_OFFERS = gql`
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
