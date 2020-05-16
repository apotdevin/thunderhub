import * as React from 'react';
import { useGetAuthTokenQuery } from 'src/generated/graphql';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAccountState } from 'src/context/AccountContext';
import { appendBasePath } from 'src/utils/basePath';

type AuthCheckProps = {
  cookieParam: string | null;
};

export const AuthSSOCheck = ({ cookieParam }: AuthCheckProps) => {
  const { query, push } = useRouter();
  const { accounts } = useAccountState();

  const { data, loading } = useGetAuthTokenQuery({
    skip: !cookieParam,
    variables: { cookie: cookieParam },
    errorPolicy: 'ignore',
  });

  React.useEffect(() => {
    if (cookieParam && !loading && data?.getAuthToken) {
      Cookies.set('SSOAuth', data.getAuthToken, {
        sameSite: 'strict',
      });
      push(appendBasePath('/'));
    }
  }, [query, push, data, loading, cookieParam, accounts]);

  return null;
};
