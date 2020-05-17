import * as React from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import {
  useAccountState,
  SSO_ACCOUNT,
  useAccountDispatch,
} from 'src/context/AccountContext';
import { appendBasePath } from 'src/utils/basePath';
import { useGetAuthTokenQuery } from 'src/graphql/queries/__generated__/getAuthToken.generated';

type AuthCheckProps = {
  cookieParam: string | null;
};

export const AuthSSOCheck = ({ cookieParam }: AuthCheckProps) => {
  const { push } = useRouter();
  const { accounts, ssoSaved } = useAccountState();
  const dispatch = useAccountDispatch();

  const { data, loading } = useGetAuthTokenQuery({
    skip: !cookieParam,
    variables: { cookie: cookieParam },
    errorPolicy: 'ignore',
  });

  React.useEffect(() => {
    if (cookieParam && !loading && data?.getAuthToken && !ssoSaved) {
      Cookies.set('SSOAuth', data.getAuthToken, {
        sameSite: 'strict',
      });
      dispatch({
        type: 'addAccounts',
        accountsToAdd: [
          {
            name: 'SSO Account',
            id: SSO_ACCOUNT,
            loggedIn: true,
            type: SSO_ACCOUNT,
          },
        ],
        isSSO: true,
      });
      push(appendBasePath('/'));
    }
  }, [push, data, loading, cookieParam, accounts, dispatch, ssoSaved]);

  return null;
};
