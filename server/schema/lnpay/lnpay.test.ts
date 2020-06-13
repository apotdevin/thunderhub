import testServer from 'server/tests/testServer';
import { GET_LN_PAY } from 'src/graphql/queries/getLnPay';
import fetchMock from 'jest-fetch-mock';
import { GraphQLError } from 'graphql';
import { GET_LN_PAY_INFO } from 'src/graphql/queries/getLnPayInfo';

describe('LnPay Resolvers', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  describe('getLnPay', () => {
    test('success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ pr: 'paymentRequest' }));
      const { query } = testServer();

      const res = await query({
        query: GET_LN_PAY,
        variables: { amount: 100 },
      });

      expect(res.errors).toBe(undefined);

      expect(fetchMock).toBeCalledWith(
        'https://thunderhub.io/api/lnpay?amount=100'
      );
      expect(res).toMatchSnapshot();
    });
    test('failure', async () => {
      fetchMock.mockRejectOnce(new Error('Error'));
      const { query } = testServer();

      const res = await query({
        query: GET_LN_PAY,
        variables: { amount: 100 },
      });

      expect(res.errors).toStrictEqual([new GraphQLError('NoLnPayInvoice')]);
      expect(res).toMatchSnapshot();
    });
  });
  describe('getLnPayInfo', () => {
    test('success', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ maxSendable: 1000, minSendable: 1 })
      );
      const { query } = testServer();

      const res = await query({
        query: GET_LN_PAY_INFO,
      });

      expect(res.errors).toBe(undefined);
      expect(fetchMock).toBeCalledWith('https://thunderhub.io/api/lnpay');
      expect(res).toMatchSnapshot();
    });
    test('failure', async () => {
      fetchMock.mockRejectOnce(new Error('Error'));
      const { query } = testServer();

      const res = await query({
        query: GET_LN_PAY_INFO,
      });

      expect(res.errors).toStrictEqual([new GraphQLError('NoLnPay')]);
      expect(res).toMatchSnapshot();
    });
  });
});
