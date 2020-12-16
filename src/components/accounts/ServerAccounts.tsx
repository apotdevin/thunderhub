import * as React from 'react';
import { useRouter } from 'next/router';
import { getUrlParam } from 'src/utils/url';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import getConfig from 'next/config';
import { useGetAuthTokenMutation } from 'src/graphql/mutations/__generated__/getAuthToken.generated';

const { publicRuntimeConfig } = getConfig();
const { logoutUrl } = publicRuntimeConfig;

export const ServerAccounts: React.FC = () => {
  const { push, query } = useRouter();

  const cookieParam = getUrlParam(query?.token);

  const [getToken, { data }] = useGetAuthTokenMutation({
    variables: { cookie: cookieParam },
    refetchQueries: ['GetNodeInfo'],
    onError: error => {
      toast.error(getErrorContent(error));
      logoutUrl ? (window.location.href = logoutUrl) : push('/login');
    },
  });

  React.useEffect(() => {
    if (cookieParam) {
      getToken();
    } else {
      logoutUrl ? (window.location.href = logoutUrl) : push('/login');
    }
  }, [cookieParam, push, getToken]);

  React.useEffect(() => {
    if (!cookieParam || !data) return;
    if (data.getAuthToken) {
      push('/');
    }
    if (!data.getAuthToken) {
      toast.warning('Unable to SSO. Check your logs.');
      logoutUrl ? (window.location.href = logoutUrl) : push('/login');
    }
  }, [push, data, cookieParam]);

  return null;
};
