import gql from 'graphql-tag';

export const GET_LATEST_VERSION = gql`
  query GetLatestVersion {
    getLatestVersion
  }
`;
