import { AuthMock } from 'server/tests/testMocks';
import testServer from 'server/tests/testServer';
import gql from 'graphql-tag';

jest.mock('ln-service');

describe('Chain Resolvers', () => {
  test('getChainBalance', async () => {
    const getChainBalance = gql`
      query($auth: authType!) {
        getChainBalance(auth: $auth)
      }
    `;
    const { query } = testServer();
    const res = await query({
      query: getChainBalance,
      variables: AuthMock,
    });
    expect(res.errors).toBe(undefined);
    expect(res).toMatchSnapshot();
  });
  test('getPendingChainBalance', async () => {
    const getPendingChainBalance = gql`
      query($auth: authType!) {
        getPendingChainBalance(auth: $auth)
      }
    `;
    const { query } = testServer();
    const res = await query({
      query: getPendingChainBalance,
      variables: AuthMock,
    });
    expect(res.errors).toBe(undefined);
    expect(res).toMatchSnapshot();
  });
});
