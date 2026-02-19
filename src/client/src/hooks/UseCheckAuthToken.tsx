import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUrlParam, safeRedirect } from '../utils/url';
import toast from 'react-hot-toast';
import { getErrorContent } from '../utils/error';
import { config } from '../config/thunderhubConfig';
import { useGetAuthTokenMutation } from '../graphql/mutations/__generated__/getAuthToken.generated';

export const useCheckAuthToken = () => {
  const { logoutUrl, basePath } = config;
  const [searchParams] = useSearchParams();

  const cookieParam = getUrlParam(searchParams.get('token') ?? undefined);

  const loginFallback = `${basePath}/login`;

  const [getToken, { data }] = useGetAuthTokenMutation({
    variables: { cookie: cookieParam },
    refetchQueries: ['GetNodeInfo'],
    onError: error => {
      toast.error(getErrorContent(error));
      safeRedirect(logoutUrl || loginFallback, loginFallback);
    },
  });

  useEffect(() => {
    if (cookieParam) {
      getToken();
    } else {
      safeRedirect(logoutUrl || loginFallback, loginFallback);
    }
  }, [cookieParam, getToken]);

  useEffect(() => {
    if (!cookieParam || !data) return;
    if (data.getAuthToken) {
      window.location.href = `${basePath}/`;
    }
    if (!data.getAuthToken) {
      toast.error('Unable to SSO. Check your logs.');
      safeRedirect(logoutUrl || loginFallback, loginFallback);
    }
  }, [data, cookieParam]);
};
