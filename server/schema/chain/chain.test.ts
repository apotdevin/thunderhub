import testServer from 'server/tests/testServer';
import { gql } from '@apollo/client';

jest.mock('ln-service');

describe('Chain Resolvers', () => {
  test('getChainBalance', async () => {
    const getChainBalance = gql`
      query {
        getChainBalance
      }
    `;
    const { query } = testServer();
    const res = await query({
      query: getChainBalance,
    });
    expect(res.errors).toBe(undefined);
    expect(res).toMatchSnapshot();
  });
  test('getPendingChainBalance', async () => {
    const getPendingChainBalance = gql`
      query {
        getPendingChainBalance
      }
    `;
    const { query } = testServer();
    const res = await query({
      query: getPendingChainBalance,
    });
    expect(res.errors).toBe(undefined);
    expect(res).toMatchSnapshot();
  });
});
