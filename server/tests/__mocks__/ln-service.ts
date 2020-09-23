import * as res from '../lnServiceResponse';

export const authenticatedLndGrpc = jest.fn().mockReturnValue({});

export const probeForRoute = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.probeForRouteResponse));

export const getNode = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getNodeResponse));

export const getNetworkInfo = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getNetworkInfoResponse));

export const getWalletInfo = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getWalletInfoResponse));

export const getClosedChannels = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getClosedChannelsResponse));

export const getChainBalance = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getChainBalanceResponse));

export const getPendingChainBalance = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getPendingChainBalanceResponse));

export const pay = jest.fn().mockReturnValue(Promise.resolve(res.payResponse));

export const decodePaymentRequest = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.decodePaymentRequestResponse));

export const getBackups = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getBackupsResponse));

export const getChainTransactions = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getChainTransactionsResponse));

export const getChannels = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getChannelsResponse));

export const getChannel = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getChannelResponse));

export const getForwards = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getForwardsResponse));

export const getInvoices = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getInvoicesResponse));

export const getChannelBalance = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getChannelBalance));

export const getPeers = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getPeersResponse));

export const getPendingChannels = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getPendingChannelsResponse));

export const getPayments = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getPayments));

export const getUtxos = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getUtxosResponse));

export const getWalletVersion = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getWalletVersionResponse));

export const recoverFundsFromChannels = jest
  .fn()
  .mockReturnValue(Promise.resolve());

export const signMessage = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.signMessageResponse));

export const verifyBackups = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.verifyBackupsResponse));

export const verifyMessage = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.verifyMessageResponse));

export const getPublicKey = jest
  .fn()
  .mockReturnValue(Promise.resolve(res.getPublicKeyResponse));
