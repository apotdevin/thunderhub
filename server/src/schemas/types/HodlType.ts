import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
} from 'graphql';

export const HodlOfferFeeType = new GraphQLObjectType({
    name: 'hodlOfferFeeType',
    fields: () => {
        return {
            author_fee_rate: { type: GraphQLString },
        };
    },
});

export const HodlOfferPaymentType = new GraphQLObjectType({
    name: 'hodlOfferPaymentType',
    fields: () => {
        return {
            id: { type: GraphQLString },
            version: { type: GraphQLString },
            payment_method_id: { type: GraphQLString },
            payment_method_type: { type: GraphQLString },
            payment_method_name: { type: GraphQLString },
        };
    },
});

export const HodlOfferTraderType = new GraphQLObjectType({
    name: 'hodlOfferTraderType',
    fields: () => {
        return {
            login: { type: GraphQLString },
            online_status: { type: GraphQLString },
            rating: { type: GraphQLString },
            trades_count: { type: GraphQLInt },
            url: { type: GraphQLString },
            verified: { type: GraphQLBoolean },
            verified_by: { type: GraphQLString },
            strong_hodler: { type: GraphQLBoolean },
            country: { type: GraphQLString },
            country_code: { type: GraphQLString },
            average_payment_time_minutes: { type: GraphQLInt },
            average_release_time_minutes: { type: GraphQLInt },
            days_since_last_trade: { type: GraphQLInt },
        };
    },
});

export const HodlOfferType = new GraphQLObjectType({
    name: 'hodlOfferType',
    fields: () => {
        return {
            id: { type: GraphQLString },
            version: { type: GraphQLString },
            asset_code: { type: GraphQLString },
            searchable: { type: GraphQLBoolean },
            country: { type: GraphQLString },
            country_code: { type: GraphQLString },
            working_now: { type: GraphQLBoolean },
            side: { type: GraphQLString },
            title: { type: GraphQLString },
            description: { type: GraphQLString },
            currency_code: { type: GraphQLString },
            price: { type: GraphQLString },
            min_amount: { type: GraphQLString },
            max_amount: { type: GraphQLString },
            first_trade_limit: { type: GraphQLString },
            fee: { type: HodlOfferFeeType },
            balance: { type: GraphQLString },
            payment_window_minutes: { type: GraphQLInt },
            confirmations: { type: GraphQLInt },
            payment_method_instructions: {
                type: new GraphQLList(HodlOfferPaymentType),
            },
            trader: { type: HodlOfferTraderType },
        };
    },
});

export const HodlCountryType = new GraphQLObjectType({
    name: 'hodlCountryType',
    fields: () => {
        return {
            code: { type: GraphQLString },
            name: { type: GraphQLString },
            native_name: { type: GraphQLString },
            currency_code: { type: GraphQLString },
            currency_name: { type: GraphQLString },
        };
    },
});

export const HodlCurrencyType = new GraphQLObjectType({
    name: 'hodlCurrencyType',
    fields: () => {
        return {
            code: { type: GraphQLString },
            name: { type: GraphQLString },
            type: { type: GraphQLString },
        };
    },
});
