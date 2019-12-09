import gql from 'graphql-tag';

export const CLOSE_CHANNEL = gql`
    mutation CloseChannel(
        $id: String!
        $auth: String!
        $forceClose: Boolean
        $target: Int
        $tokens: Int
    ) {
        closeChannel(
            id: $id
            forceClose: $forceClose
            targetConfirmations: $target
            tokensPerVByte: $tokens
            auth: $auth
        ) {
            transactionId
            transactionOutputIndex
        }
    }
`;

export const PAY_INVOICE = gql`
    mutation PayInvoice($request: String!, $auth: String!) {
        pay(request: $request, auth: $auth) {
            isConfirmed
        }
    }
`;

export const CREATE_INVOICE = gql`
    mutation PayInvoice($amount: Int!, $auth: String!) {
        createInvoice(amount: $amount, auth: $auth) {
            request
        }
    }
`;

export const CREATE_ADDRESS = gql`
    mutation CreateAddress($nested: Boolean, $auth: String!) {
        createAddress(nested: $nested, auth: $auth)
    }
`;

export const PAY_ADDRESS = gql`
    mutation PayAddress(
        $auth: String!
        $address: String!
        $tokens: Number!
        $fee: Number
        $target: Number
        $sendAll: Boolean
    ) {
        sendToAddress(
            auth: $auth
            address: $address
            tokens: $tokens
            fee: $fee
            target: $target
            sendAll: $sendAll
        )
    }
`;

export const DECODE_REQUEST = gql`
    mutation decodeRequest($auth: String!, $request: String!) {
        decodeRequest(auth: $auth, request: $request) {
            chainAddress
            cltvDelta
            description
            descriptionHash
            destination
            expiresAt
            id
            routes {
                baseFeeMTokens
                channel
                cltvDelta
                feeRate
                publicKey
            }
            tokens
        }
    }
`;
