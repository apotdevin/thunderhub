import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLoginAmbossMutation } from '../../../../graphql/mutations/__generated__/loginAmboss.generated';
import { useGetAmbossLoginTokenLazyQuery } from '../../../../graphql/queries/__generated__/getAmbossLoginToken.generated';
import { useAmbossUser } from '../../../../hooks/UseAmbossUser';
import { appendBasePath } from '../../../../utils/basePath';

export const AmbossCard = () => {
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

    const url = data.getAmbossLoginToken;
    (window as any).open(url, '_blank').focus();
  }, [data, tokenLoading]);

  if (!user) {
    return (
      <button
        className="bg-white dark:bg-[#1a1f35] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-[#e1e6ed] dark:border-[#4a5669] h-20 w-20 flex flex-col justify-center items-center p-1 cursor-pointer text-[#69c0ff] md:p-2.5 md:h-[100px] md:w-[100px] hover:bg-[#ff0080] hover:text-white group"
        onClick={() => {
          if (loading) return;
          login();
        }}
        disabled={loading}
      >
        <img
          className="group-hover:brightness-0 group-hover:invert"
          src={appendBasePath('/assets/amboss_icon.png')}
          width={32}
          height={32}
          alt={'Amboss Logo'}
        />
        <div className="text-xs text-muted-foreground mt-2.5 group-hover:text-white">
          {loading ? 'Loading...' : 'Login'}
        </div>
      </button>
    );
  }

  return (
    <button
      className="bg-white dark:bg-[#1a1f35] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-[#e1e6ed] dark:border-[#4a5669] h-20 w-20 flex flex-col justify-center items-center p-1 cursor-pointer text-[#69c0ff] md:p-2.5 md:h-[100px] md:w-[100px] hover:bg-[#ff0080] hover:text-white group"
      onClick={() => {
        if (tokenLoading) return;
        getToken();
      }}
      disabled={tokenLoading}
    >
      <img
        className="group-hover:brightness-0 group-hover:invert"
        src={appendBasePath('/assets/amboss_icon.png')}
        width={32}
        height={32}
        alt={'Amboss Logo'}
      />
      <div className="text-xs text-muted-foreground mt-2.5 group-hover:text-white">
        {tokenLoading ? 'Loading...' : 'Go To'}
      </div>
    </button>
  );
};
