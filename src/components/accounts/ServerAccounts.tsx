import * as React from 'react';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';
import { getUrlParam } from 'src/utils/url';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { useGetAuthTokenMutation } from 'src/graphql/mutations/__generated__/getAuthToken.generated';

export const ServerAccounts: React.FC = () => {
  const { push, query } = useRouter();

  const cookieParam = getUrlParam(query?.token);

  const [getToken, { data }] = useGetAuthTokenMutation({
    variables: { cookie: cookieParam },
    refetchQueries: ['GetNodeInfo'],
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
