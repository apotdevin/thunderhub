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
