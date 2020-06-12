import testServer from 'server/tests/testServer';
import { GET_NETWORK_INFO } from 'src/graphql/queries/getNetworkInfo';

jest.mock('logger');
jest.mock('ln-service');

describe('Network Resolvers', () => {
  describe('getNetworkInfo', () => {
    test('success', async () => {
      const { query } = testServer();

      const res = await query({
        query: GET_NETWORK_INFO,
        variables: { auth: { type: 'test' } },
      });

      expect(res.errors).toBe(undefined);
      expect(res).toMatchSnapshot();
    });
  });
});
