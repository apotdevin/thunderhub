import { gql } from 'apollo-server-micro';

export const widgetTypes = gql`
  type InOutType {
    invoices: String
    payments: String
    confirmedInvoices: Int
    unConfirmedInvoices: Int
  }
`;
