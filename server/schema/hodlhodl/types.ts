import { gql } from 'apollo-server-micro';

export const hodlTypes = gql`
  type hodlCountryType {
    code: String
    name: String
    native_name: String
    currency_code: String
    currency_name: String
  }

  type hodlCurrencyType {
    code: String
    name: String
    type: String
  }

  type hodlOfferFeeType {
    author_fee_rate: String
  }

  type hodlOfferPaymentType {
    id: String
    version: String
    payment_method_id: String
    payment_method_type: String
    payment_method_name: String
  }

  type hodlOfferTraderType {
    login: String
    online_status: String
    rating: String
    trades_count: Int
    url: String
    verified: Boolean
    verified_by: String
    strong_hodler: Boolean
    country: String
    country_code: String
    average_payment_time_minutes: Int
    average_release_time_minutes: Int
    days_since_last_trade: Int
  }

  type hodlOfferType {
    id: String
    version: String
    asset_code: String
    searchable: Boolean
    country: String
    country_code: String
    working_now: Boolean
    side: String
    title: String
    description: String
    currency_code: String
    price: String
    min_amount: String
    max_amount: String
    first_trade_limit: String
    fee: hodlOfferFeeType
    balance: String
    payment_window_minutes: Int
    confirmations: Int
    payment_method_instructions: [hodlOfferPaymentType]
    trader: hodlOfferTraderType
  }
`;
