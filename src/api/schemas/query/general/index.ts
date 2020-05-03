import { getNetworkInfo } from './networkInfo';
import { getNodeInfo } from './nodeInfo';
import { getNode } from './getNode';
import { adminCheck } from './adminCheck';
import { decodeRequest } from './decode';
import { getWalletInfo } from './walletInfo';

export const generalQueries = {
  getNetworkInfo,
  getNodeInfo,
  adminCheck,
  getNode,
  decodeRequest,
  getWalletInfo,
};
