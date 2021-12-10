import { gql } from '@apollo/client';

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
