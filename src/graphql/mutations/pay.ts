import gql from 'graphql-tag';

export const PAY_INVOICE = gql`
  mutation PayInvoice($request: String!, $auth: authType!, $tokens: Int) {
    pay(request: $request, auth: $auth, tokens: $tokens) {
      is_confirmed
    }
  }
`;
