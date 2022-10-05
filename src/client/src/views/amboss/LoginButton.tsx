import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAmbossUser } from '../../hooks/UseAmbossUser';
import { useLoginAmbossMutation } from '../../graphql/mutations/__generated__/loginAmboss.generated';
import { useGetAmbossLoginTokenLazyQuery } from '../../graphql/queries/__generated__/getAmbossLoginToken.generated';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';

export const AmbossLoginButton = () => {
  const { user } = useAmbossUser();

  const [login, { loading }] = useLoginAmbossMutation({
    onCompleted: () => toast.success('Logged in'),
    onError: () => toast.error('Error logging in'),
    refetchQueries: ['GetAmbossUser', 'GetChannels'],
  });

  const [getToken, { data, loading: tokenLoading }] =
    useGetAmbossLoginTokenLazyQuery({
      fetchPolicy: 'network-only',
      onError: () => toast.error('Error getting auth token'),
    });

  useEffect(() => {
    if (!data?.getAmbossLoginToken || tokenLoading) {
      return;
    }
    if (!window?.open) return;
    const url = `https://amboss.space/token?key=${data.getAmbossLoginToken}`;
    (window as any).open(url, '_blank').focus();
  }, [data, tokenLoading]);

  if (!user) {
    return (
      <ColorButton
        color="#ff0080"
        onClick={() => {
          if (loading) return;
          login();
        }}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Login'}
      </ColorButton>
    );
  }

  return (
    <ColorButton
      color="#ff0080"
      onClick={() => {
        if (tokenLoading) return;
        getToken();
      }}
      disabled={tokenLoading}
    >
      {tokenLoading ? 'Loading...' : 'Go To'}
    </ColorButton>
  );
};
