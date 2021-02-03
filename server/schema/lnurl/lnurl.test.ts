import testServer from 'server/tests/testServer';
import fetchMock from 'jest-fetch-mock';
import { GraphQLError } from 'graphql';
import { WITHDRAW_LN_URL } from 'src/graphql/mutations/lnUrl';

jest.mock('ln-service');

describe('LNURL Resolvers', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  describe('getBitcoinPrice', () => {
    test('success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ status: 'SUCCESS' }));
      const { mutate } = testServer();

      const res = await mutate({
        mutation: WITHDRAW_LN_URL,
        variables: {
          callback: 'https://domain.com',
          amount: 1000,
          k1: 'random',
          description: 'ln-withdraw',
        },
      });

      expect(res.errors).toBe(undefined);

      expect(fetchMock).toBeCalledWith(
        'https://domain.com?k1=random&pr=boltEncodedRequest',
        undefined
      );
      expect(res).toMatchSnapshot();
    });
    test('success with callback that has query string', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ status: 'SUCCESS' }));
      const { mutate } = testServer();

      const res = await mutate({
        mutation: WITHDRAW_LN_URL,
        variables: {
          callback: 'https://domain.com?user=123456',
          amount: 1000,
          k1: 'random',
          description: 'ln-withdraw',
        },
      });

      expect(res.errors).toBe(undefined);

      expect(fetchMock).toBeCalledWith(
        'https://domain.com?user=123456&k1=random&pr=boltEncodedRequest',
        undefined
      );
    });
    test('success but not able to withdraw', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ status: 'ERROR' }));
      const { mutate } = testServer();

      const res = await mutate({
        mutation: WITHDRAW_LN_URL,
        variables: {
          callback: 'https://domain.com',
          amount: 1000,
          k1: 'random',
          description: 'ln-withdraw',
        },
      });

      expect(res.errors).toStrictEqual([
        new GraphQLError('ProblemWithdrawingFromLnUrlService'),
      ]);
    });
    test('failure', async () => {
      fetchMock.mockRejectOnce(new Error('Error'));
      const { mutate } = testServer();

      const res = await mutate({
        mutation: WITHDRAW_LN_URL,
        variables: {
          callback: 'domain.com',
          amount: 1000,
          k1: 'random',
          description: 'ln-withdraw',
        },
      });

      expect(res.errors).toStrictEqual([
        new GraphQLError('ProblemWithdrawingFromLnUrlService'),
      ]);
      expect(res).toMatchSnapshot();
    });
  });
});
