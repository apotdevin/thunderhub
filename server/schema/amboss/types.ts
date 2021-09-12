import { gql } from 'apollo-server-micro';

export const ambossTypes = gql`
  type AmbossSubscriptionType {
    end_date: String!
    subscribed: Boolean!
    upgradable: Boolean!
  }

  type AmbossUserType {
    subscription: AmbossSubscriptionType
  }
`;
