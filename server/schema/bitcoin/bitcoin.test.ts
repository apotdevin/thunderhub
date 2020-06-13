import testServer from 'server/tests/testServer';
import fetchMock from 'jest-fetch-mock';
import { GraphQLError } from 'graphql';
import { GET_BITCOIN_PRICE } from 'src/graphql/queries/getBitcoinPrice';
import { GET_BITCOIN_FEES } from 'src/graphql/queries/getBitcoinFees';

describe('Bitcoin Resolvers', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  describe('getBitcoinPrice', () => {
    test('success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ price: 'price' }));
      const { query } = testServer();

      const res = await query({
        query: GET_BITCOIN_PRICE,
      });

      expect(res.errors).toBe(undefined);

      expect(fetchMock).toBeCalledWith('https://blockchain.info/ticker');
      expect(res).toMatchSnapshot();
    });
    test('failure', async () => {
      fetchMock.mockRejectOnce(new Error('Error'));
      const { query } = testServer();

      const res = await query({
        query: GET_BITCOIN_PRICE,
      });

      expect(res.errors).toStrictEqual([
        new GraphQLError('Problem getting Bitcoin price.'),
      ]);
      expect(res).toMatchSnapshot();
    });
  });
  describe('getBitcoinFees', () => {
    test('success', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          fastestFee: 3,
          halfHourFee: 2,
          hourFee: 1,
        })
      );
      const { query } = testServer();

      const res = await query({
        query: GET_BITCOIN_FEES,
      });

      expect(res.errors).toBe(undefined);

      expect(fetchMock).toBeCalledWith(
        'https://bitcoinfees.earn.com/api/v1/fees/recommended'
      );
      expect(res).toMatchSnapshot();
    });
    test('failure', async () => {
      fetchMock.mockRejectOnce(new Error('Error'));
      const { query } = testServer();

      const res = await query({
        query: GET_BITCOIN_FEES,
      });

      expect(res.errors).toStrictEqual([
        new GraphQLError('Problem getting Bitcoin fees.'),
      ]);
      expect(res).toMatchSnapshot();
    });
  });
});
