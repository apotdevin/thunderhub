import getVolumeHealth from './resolvers/getVolumeHealth';
import getTimeHealth from './resolvers/getTimeHealth';
import getFeeHealth from './resolvers/getFeeHealth';

export const healthResolvers = {
  Query: {
    getVolumeHealth,
    getTimeHealth,
    getFeeHealth,
  },
};
