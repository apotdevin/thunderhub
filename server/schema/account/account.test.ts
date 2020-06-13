import testServer from 'server/tests/testServer';
import { GET_SERVER_ACCOUNTS } from 'src/graphql/queries/getServerAccounts';
import { ContextMockNoSSO } from 'server/tests/testMocks';

jest.mock('ln-service');

describe('Account Resolvers', () => {
  describe('getServerAccounts', () => {
    test('full accounts', async () => {
      const { query } = testServer();

      const res = await query({
        query: GET_SERVER_ACCOUNTS,
        variables: { auth: { type: 'test' } },
      });

      expect(res.errors).toBe(undefined);
      expect(res).toMatchSnapshot();
    });
    test('without SSO', async () => {
      const { query } = testServer(ContextMockNoSSO);

      const res = await query({
        query: GET_SERVER_ACCOUNTS,
        variables: { auth: { type: 'test' } },
      });

      expect(res.errors).toBe(undefined);
      expect(res).toMatchSnapshot();
    });
    test('without accounts', async () => {
      const { query } = testServer(ContextMockNoSSO);

      const res = await query({
        query: GET_SERVER_ACCOUNTS,
        variables: { auth: { type: 'test' } },
      });

      expect(res.errors).toBe(undefined);
      expect(res).toMatchSnapshot();
    });
  });
});
