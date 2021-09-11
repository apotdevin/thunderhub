import testServer from 'server/tests/testServer';
import { DECODE_REQUEST } from '../decodeRequest';
import { GET_BACKUPS } from '../getBackups';
import { GET_CHAIN_TRANSACTIONS } from '../getChainTransactions';
import { CHANNEL_FEES } from '../getChannelFees';
import { GET_LIQUID_REPORT } from '../getChannelReport';
import { GET_CHANNELS } from '../getChannels';
import { GET_CLOSED_CHANNELS } from '../getClosedChannels';
import { GET_FEE_HEALTH } from '../getFeeHealth';
// import { GET_FORWARDS_PAST_DAYS } from '../getForwardsPastDays';
import { GET_MESSAGES } from '../getMessages';
import { GET_NETWORK_INFO } from '../getNetworkInfo';
import { GET_NODE } from '../getNode';
import { GET_NODE_INFO } from '../getNodeInfo';
import { GET_PEERS } from '../getPeers';
import { GET_PENDING_CHANNELS } from '../getPendingChannels';
// import { GET_RESUME } from '../getResume';
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
jest.mock('balanceofsatoshis/swaps');

type CaseType = [string, { query: any; variables?: {} }];

const cases: CaseType[] = [
  ['DECODE_REQUEST', { query: DECODE_REQUEST, variables: { request: '' } }],
  ['GET_BACKUPS', { query: GET_BACKUPS }],
  ['GET_CHAIN_TRANSACTIONS', { query: GET_CHAIN_TRANSACTIONS }],
  ['GET_CHANNEL_FEES', { query: CHANNEL_FEES }],
  ['GET_LIQUID_REPORT', { query: GET_LIQUID_REPORT }],
  ['GET_CHANNELS', { query: GET_CHANNELS }],
  ['GET_CLOSED_CHANNELS', { query: GET_CLOSED_CHANNELS }],
  ['GET_FEE_HEALTH', { query: GET_FEE_HEALTH }],
  // [
  //   'GET_FORWARD_CHANNELS_REPORT',
  //   { query: GET_FORWARD_CHANNELS_REPORT },
  // ],
  // ['GET_FORWARD_REPORT', { query: GET_FORWARD_REPORT }],
  // [
  //   'GET_FORWARDS_PAST_DAYS',
  //   { query: GET_FORWARDS_PAST_DAYS, variables: { days: 30 } },
  // ],
  ['GET_MESSAGES', { query: GET_MESSAGES }],
  ['GET_NETWORK_INFO', { query: GET_NETWORK_INFO }],
  ['GET_NODE', { query: GET_NODE, variables: { publicKey: 'abc' } }],
  [
    'GET_NODE withoutChannels',
    {
      query: GET_NODE,
      variables: { publicKey: 'abc', withoutChannels: false },
    },
  ],
  ['GET_NODE_INFO', { query: GET_NODE_INFO }],
  ['GET_PEERS', { query: GET_PEERS }],
  ['GET_PENDING_CHANNELS', { query: GET_PENDING_CHANNELS }],
  // ['GET_RESUME', { query: GET_RESUME }],
  ['GET_SERVER_ACCOUNTS', { query: GET_SERVER_ACCOUNTS }],
  ['GET_TIME_HEALTH', { query: GET_TIME_HEALTH }],
  ['GET_UTXOS', { query: GET_UTXOS }],
  ['GET_VOLUME_HEALTH', { query: GET_VOLUME_HEALTH }],
  ['GET_WALLET_INFO', { query: GET_WALLET_INFO }],
  [
    'RECOVER_FUNDS',
    {
      query: RECOVER_FUNDS,
      variables: { backup: '{"backup":"backup_string"}' },
    },
  ],
  ['SIGN_MESSAGE', { query: SIGN_MESSAGE, variables: { message: 'message' } }],
  [
    'VERIFY_BACKUPS',
    {
      query: VERIFY_BACKUPS,
      variables: { backup: '{"backup":"backup_string"}' },
    },
  ],
  [
    'VERIFY_MESSAGE',
    {
      query: VERIFY_MESSAGE,
      variables: { message: 'message', signature: 'signature' },
    },
  ],
];

describe('Query tests', () => {
  test.each(cases)('%p matches snapshot', async (_, test) => {
    const { query } = testServer();
    const res = await query({
      query: test.query,
      ...(test.variables && { variables: test.variables }),
    });

    if (res.errors) {
      console.log(JSON.stringify(res.errors));
    }

    expect(res.errors).toBe(undefined);
    expect(res).toMatchSnapshot();
  });
});
