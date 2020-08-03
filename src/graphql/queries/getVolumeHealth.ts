import { gql } from 'apollo-server-micro';

export const GET_VOLUME_HEALTH = gql`
  query GetVolumeHealth {
    getVolumeHealth {
      score
      channels {
        id
        score
        volumeNormalized
        averageVolumeNormalized
        partner {
          node {
            alias
          }
        }
      }
    }
  }
`;
