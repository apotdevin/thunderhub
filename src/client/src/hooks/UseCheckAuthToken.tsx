import * as React from 'react';
import { useRouter } from 'next/router';
import { getUrlParam } from '../utils/url';
import { toast } from 'react-toastify';
import { getErrorContent } from '../utils/error';
import getConfig from 'next/config';
import { useGetAuthTokenMutation } from '../graphql/mutations/__generated__/getAuthToken.generated';

const { publicRuntimeConfig } = getConfig();
const { logoutUrl, basePath } = publicRuntimeConfig;

export const useCheckAuthToken = () => {
  const { query } = useRouter();

  const cookieParam = getUrlParam(query?.token);

  const [getToken, { data }] = useGetAuthTokenMutation({
    variables: { cookie: cookieParam },
    refetchQueries: ['GetNodeInfo'],
    onError: error => {
      toast.error(getErrorContent(error));
      window.location.href = logoutUrl || `${basePath}/login`;
    },
  });

  React.useEffect(() => {
    if (cookieParam) {
      getToken();
    } else {
      window.location.href = logoutUrl || `${basePath}/login`;
    }
  }, [cookieParam, getToken]);

  React.useEffect(() => {
    if (!cookieParam || !data) return;
    if (data.getAuthToken) {
      window.location.href = `${basePath}/`;
    }
    if (!data.getAuthToken) {
      toast.warning('Unable to SSO. Check your logs.');
      window.location.href = logoutUrl || `${basePath}/login`;
    }
  }, [data, cookieParam]);
};
