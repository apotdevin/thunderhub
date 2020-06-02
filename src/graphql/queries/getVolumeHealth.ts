import { gql } from 'apollo-server-micro';

export const GET_VOLUME_HEALTH = gql`
  query GetVolumeHealth($auth: authType!) {
    getVolumeHealth(auth: $auth) {
      score
      channels {
        id
        score
        partner {
          node {
            alias
          }
        }
      }
    }
  }
`;
