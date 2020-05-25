import * as React from 'react';
import { useRouter } from 'next/router';
import {
  useAccountState,
  useAccountDispatch,
  SSO_ACCOUNT,
} from 'src/context/AccountContext';
import { appendBasePath } from 'src/utils/basePath';
import { useGetAuthTokenQuery } from 'src/graphql/queries/__generated__/getAuthToken.generated';
import { getUrlParam } from 'src/utils/url';

export const AuthSSOCheck = () => {
  const { push, query } = useRouter();
  const { accounts, ssoSaved } = useAccountState();
  const dispatch = useAccountDispatch();

  const cookieParam = getUrlParam(query?.token);

  const { data, loading } = useGetAuthTokenQuery({
    skip: !cookieParam,
    variables: { cookie: cookieParam },
    errorPolicy: 'ignore',
  });

  React.useEffect(() => {
    if (cookieParam && !loading && data && data.getAuthToken && !ssoSaved) {
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
