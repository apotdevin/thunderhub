import * as React from 'react';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';
import { getUrlParam } from 'src/utils/url';
import { useGetAuthTokenQuery } from 'src/graphql/queries/__generated__/getAuthToken.generated';

export const ServerAccounts: React.FC = () => {
  const { push, query } = useRouter();

  const cookieParam = getUrlParam(query?.token);

  const { data: authData } = useGetAuthTokenQuery({
    skip: !cookieParam,
    variables: { cookie: cookieParam },
    errorPolicy: 'ignore',
  });

  React.useEffect(() => {
    if (cookieParam && authData && authData.getAuthToken) {
      push(appendBasePath('/'));
    }
  }, [push, authData, cookieParam]);

  return null;
};
