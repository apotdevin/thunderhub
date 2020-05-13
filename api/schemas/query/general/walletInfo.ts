import { getWalletVersion } from 'ln-service';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, to } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { WalletInfoType } from '../../types/QueryType';

export const getWalletInfo = {
  type: WalletInfoType,
  args: defaultParams,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getWalletInfo');

    const lnd = getAuthLnd(params.auth);

    return await to(
      getWalletVersion({
        lnd,
      })
    );
  },
};
