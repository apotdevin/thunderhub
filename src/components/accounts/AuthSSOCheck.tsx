import * as React from 'react';
import { useGetAuthTokenQuery } from 'src/generated/graphql';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAccount } from 'src/context/AccountContext';

type AuthCheckProps = {
  cookieParam: string | null;
};

export const AuthSSOCheck = ({ cookieParam }: AuthCheckProps) => {
  const { query, push } = useRouter();
  const { accounts } = useAccount();

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
      push('/');
    }
  }, [query, push, data, loading, cookieParam, accounts]);

  return null;
};
