import * as React from 'react';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';
import { getUrlParam } from 'src/utils/url';
import { useGetAuthTokenLazyQuery } from 'src/graphql/queries/__generated__/getAuthToken.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';

export const ServerAccounts: React.FC = () => {
  const { push, query } = useRouter();

  const cookieParam = getUrlParam(query?.token);

  const [getToken, { data }] = useGetAuthTokenLazyQuery({
    variables: { cookie: cookieParam },
    onError: error => {
      toast.error(getErrorContent(error));
      push(appendBasePath('/login'));
    },
  });

  React.useEffect(() => {
    if (cookieParam) {
      getToken();
    } else {
      push(appendBasePath('/login'));
    }
  }, [cookieParam, push, getToken]);

  React.useEffect(() => {
    if (!cookieParam || !data) return;
    if (data.getAuthToken) {
      push(appendBasePath('/'));
    }
    if (!data.getAuthToken) {
      toast.warning('Unable to SSO. Check your logs.');
    }
  }, [push, data, cookieParam]);

  return null;
};
