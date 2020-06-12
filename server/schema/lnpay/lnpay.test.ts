import testServer from 'server/tests/testServer';
import { GET_LN_PAY } from 'src/graphql/queries/getLnPay';
import fetchMock from 'jest-fetch-mock';
import { GraphQLError } from 'graphql';
import { GET_LN_PAY_INFO } from 'src/graphql/queries/getLnPayInfo';

jest.mock('logger');

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('LnPay Resovlers', () => {
  describe('getLnPay', () => {
    test('success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ pr: 'paymentRequest' }));
      const { query } = testServer();

      const res = await query({
        query: GET_LN_PAY,
        variables: { amount: 100 },
      });

      expect(res.errors).toBe(undefined);

      expect(res?.data?.getLnPay).toEqual('paymentRequest');
    });
    test('failure', async () => {
      fetchMock.mockRejectOnce(() => Promise.reject('Error'));
      const { query } = testServer();

      const res = await query({
        query: GET_LN_PAY,
        variables: { amount: 100 },
      });

      expect(res.errors).toStrictEqual([new GraphQLError('NoLnPayInvoice')]);
      expect(res?.data?.getLnPay).toBeNull();
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

      expect(res?.data?.getLnPayInfo).toEqual({ max: 1000, min: 1 });
    });
    test('failure', async () => {
      fetchMock.mockRejectOnce(() => Promise.reject('Error'));
      const { query } = testServer();

      const res = await query({
        query: GET_LN_PAY_INFO,
      });

      expect(res.errors).toStrictEqual([new GraphQLError('NoLnPay')]);
      expect(res?.data?.getLnPayInfo).toBeNull();
    });
  });
});
