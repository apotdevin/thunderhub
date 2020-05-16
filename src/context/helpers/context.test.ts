import {
  CLIENT_ACCOUNT,
  SSO_ACCOUNT,
  CompleteAccount,
} from '../NewAccountContext';
import { getAccountById, deleteAccountById } from './context';

const firstAccount = {
  name: 'Hola',
  host: 'Host1',
  admin: 'Admin1',
  viewOnly: 'ViewOnly1',
  cert: 'Cert1',
  id: '123',
  type: CLIENT_ACCOUNT,
};
const secondAccount = {
  name: 'Chao',
  host: 'Host2',
  admin: 'Admin2',
  viewOnly: 'ViewOnly2',
  cert: 'Cert2',
  id: '1234',
  type: SSO_ACCOUNT,
};

const testAccounts: CompleteAccount[] = [firstAccount, secondAccount];

describe('Context Helpers', () => {
  describe('should getAccountById', () => {
    test('account exists', () => {
      const { account, id } = getAccountById('1234', testAccounts);

      expect(id).toBe('1234');
      expect(account).toBe(secondAccount);
    });
    test('account does not exists', () => {
      const { account, id } = getAccountById('false id', testAccounts);

      expect(id).toBe(null);
      expect(account).toBe(null);
    });
  });
  describe('should deleteAccountById', () => {
    test('account exists', () => {
      const { accounts, id } = deleteAccountById('123', '1234', testAccounts);

      expect(id).toBe('123');
      expect(accounts).toStrictEqual([firstAccount]);
    });
    test('account exists and is current account', () => {
      const { accounts, id } = deleteAccountById('123', '123', testAccounts);

      expect(id).toBe('1234');
      expect(accounts).toStrictEqual([secondAccount]);
    });
    test('account does not exists', () => {
      const { accounts, id } = deleteAccountById(
        '123',
        'false id',
        testAccounts
      );

      expect(id).toBe('123');
      expect(accounts).toStrictEqual(testAccounts);
    });

    test('one account', () => {
      const { accounts, id } = deleteAccountById('123', '123', [firstAccount]);

      expect(id).toBe(null);
      expect(accounts).toStrictEqual([]);
    });
  });
});
