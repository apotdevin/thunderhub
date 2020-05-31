import { getWalletVersion } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { WalletInfoType } from '../../types/QueryType';

export const getWalletInfo = {
  type: WalletInfoType,
  args: defaultParams,
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getWalletInfo');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    return await to(
      getWalletVersion({
        lnd,
      })
    );
  },
};
