import { AuthMock } from 'server/tests/testMocks';
import testServer from 'server/tests/testServer';
import { DECODE_REQUEST } from '../decodeRequest';
import { GET_BACKUPS } from '../getBackups';
import { GET_CHAIN_TRANSACTIONS } from '../getChainTransactions';
import { CHANNEL_FEES } from '../getChannelFees';
import { GET_LIQUID_REPORT } from '../getChannelReport';
import { GET_CHANNELS } from '../getChannels';
import { GET_CLOSED_CHANNELS } from '../getClosedChannels';
import { GET_FEE_HEALTH } from '../getFeeHealth';
// import { GET_FORWARD_REPORT } from '../getForwardReport';
import { GET_FORWARDS } from '../getForwards';
import { GET_MESSAGES } from '../getMessages';
import { GET_NETWORK_INFO } from '../getNetworkInfo';
import { GET_NODE } from '../getNode';
import {
  GET_NODE_INFO,
  GET_CAN_CONNECT,
  GET_CHANNEL_AMOUNT_INFO,
  GET_CONNECT_INFO,
} from '../getNodeInfo';
import { GET_PEERS } from '../getPeers';
import { GET_PENDING_CHANNELS } from '../getPendingChannels';
import { GET_RESUME } from '../getResume';
import { GET_SERVER_ACCOUNTS } from '../getServerAccounts';
import { GET_TIME_HEALTH } from '../getTimeHealth';
import { GET_UTXOS } from '../getUtxos';
import { GET_VOLUME_HEALTH } from '../getVolumeHealth';
import { GET_WALLET_INFO } from '../getWalletInfo';
import { RECOVER_FUNDS } from '../recoverFunds';
import { SIGN_MESSAGE } from '../signMessage';
import { VERIFY_BACKUPS } from '../verifyBackups';
import { VERIFY_MESSAGE } from '../verifyMessage';

jest.mock('ln-service');

jest.mock('balanceofsatoshis/swaps', () => ({
  rebalance: jest.fn().mockReturnValue(Promise.resolve({})),
}));

type CaseType = [string, { query: any; variables: {} }];

const cases: CaseType[] = [
  [
    'DECODE_REQUEST',
    { query: DECODE_REQUEST, variables: { ...AuthMock, request: '' } },
  ],
  ['GET_BACKUPS', { query: GET_BACKUPS, variables: AuthMock }],
  [
    'GET_CHAIN_TRANSACTIONS',
    { query: GET_CHAIN_TRANSACTIONS, variables: AuthMock },
  ],
  ['GET_CHANNEL_FEES', { query: CHANNEL_FEES, variables: AuthMock }],
  ['GET_LIQUID_REPORT', { query: GET_LIQUID_REPORT, variables: AuthMock }],
  ['GET_CHANNELS', { query: GET_CHANNELS, variables: AuthMock }],
  ['GET_CLOSED_CHANNELS', { query: GET_CLOSED_CHANNELS, variables: AuthMock }],
  ['GET_FEE_HEALTH', { query: GET_FEE_HEALTH, variables: AuthMock }],
  // [
  //   'GET_FORWARD_CHANNELS_REPORT',
  //   { query: GET_FORWARD_CHANNELS_REPORT, variables: AuthMock },
  // ],
  // ['GET_FORWARD_REPORT', { query: GET_FORWARD_REPORT, variables: AuthMock }],
  ['GET_FORWARDS', { query: GET_FORWARDS, variables: AuthMock }],
  ['GET_MESSAGES', { query: GET_MESSAGES, variables: AuthMock }],
  ['GET_NETWORK_INFO', { query: GET_NETWORK_INFO, variables: AuthMock }],
  [
    'GET_NODE',
    { query: GET_NODE, variables: { ...AuthMock, publicKey: 'abc' } },
  ],
  [
    'GET_NODE withoutChannels',
    {
      query: GET_NODE,
      variables: { ...AuthMock, publicKey: 'abc', withoutChannels: false },
    },
  ],
  ['GET_CAN_CONNECT', { query: GET_CAN_CONNECT, variables: AuthMock }],
  ['GET_NODE_INFO', { query: GET_NODE_INFO, variables: AuthMock }],
  [
    'GET_CHANNEL_AMOUNT_INFO',
    { query: GET_CHANNEL_AMOUNT_INFO, variables: AuthMock },
  ],
  ['GET_CONNECT_INFO', { query: GET_CONNECT_INFO, variables: AuthMock }],
  ['GET_PEERS', { query: GET_PEERS, variables: AuthMock }],
  [
    'GET_PENDING_CHANNELS',
    { query: GET_PENDING_CHANNELS, variables: AuthMock },
  ],
  ['GET_RESUME', { query: GET_RESUME, variables: AuthMock }],
  ['GET_SERVER_ACCOUNTS', { query: GET_SERVER_ACCOUNTS, variables: AuthMock }],
  ['GET_TIME_HEALTH', { query: GET_TIME_HEALTH, variables: AuthMock }],
  ['GET_UTXOS', { query: GET_UTXOS, variables: AuthMock }],
  ['GET_VOLUME_HEALTH', { query: GET_VOLUME_HEALTH, variables: AuthMock }],
  ['GET_WALLET_INFO', { query: GET_WALLET_INFO, variables: AuthMock }],
  [
    'RECOVER_FUNDS',
    {
      query: RECOVER_FUNDS,
      variables: { ...AuthMock, backup: '{"backup":"backup_string"}' },
    },
  ],
  [
    'SIGN_MESSAGE',
    { query: SIGN_MESSAGE, variables: { ...AuthMock, message: 'message' } },
  ],
  [
    'VERIFY_BACKUPS',
    {
      query: VERIFY_BACKUPS,
      variables: { ...AuthMock, backup: '{"backup":"backup_string"}' },
    },
  ],
  [
    'VERIFY_MESSAGE',
    {
      query: VERIFY_MESSAGE,
      variables: { ...AuthMock, message: 'message', signature: 'signature' },
    },
  ],
];

describe('Query tests', () => {
  test.each(cases)('%p matches snapshot', async (_, test) => {
    const { query } = testServer();
    const res = await query({
      query: test.query,
      variables: test.variables,
    });

    if (res.errors) {
      console.log(JSON.stringify(res.errors));
    }

    expect(res.errors).toBe(undefined);
    expect(res).toMatchSnapshot();
  });
});
