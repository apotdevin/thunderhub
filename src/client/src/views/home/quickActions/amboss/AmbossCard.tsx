import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useLoginAmbossMutation } from '../../../../graphql/mutations/__generated__/loginAmboss.generated';
import { useGetAmbossLoginTokenLazyQuery } from '../../../../graphql/queries/__generated__/getAmbossLoginToken.generated';
import { useAmbossUser } from '../../../../hooks/UseAmbossUser';
import { appendBasePath } from '../../../../utils/basePath';
import { QuickCard, QuickTitle } from '../QuickActions';

const useAmbossAction = () => {
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

  const isLoading = user ? tokenLoading : loading;
  const label = isLoading ? 'Loading...' : user ? 'Go To' : 'Login';

  const handleClick = () => {
    if (user) {
      if (!tokenLoading) getToken();
    } else {
      if (!loading) login();
    }
  };

  return { label, handleClick };
};

export const AmbossCard = () => {
  const { label, handleClick } = useAmbossAction();

  return (
    <QuickCard
      className="hover:border-purple-500/30 hover:bg-purple-500/5"
      onClick={handleClick}
    >
      <img
        src={appendBasePath('/assets/amboss_icon.png')}
        width={16}
        height={16}
        alt="Amboss Logo"
      />
      <QuickTitle>{label}</QuickTitle>
    </QuickCard>
  );
};

export const AmbossGridItem = () => {
  const { label, handleClick } = useAmbossAction();

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group/quick flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1.5 transition-all duration-200 cursor-pointer',
        'hover:border-border hover:bg-muted/50',
        'hover:shadow-[0_0_12px_-3px] hover:shadow-purple-500/20'
      )}
    >
      <div className="flex items-center justify-center size-6 rounded-md bg-muted/60 transition-colors duration-200 group-hover/quick:bg-purple-500/10">
        <img
          src={appendBasePath('/assets/amboss_icon.png')}
          width={12}
          height={12}
          alt="Amboss Logo"
        />
      </div>
      <span className="text-[11px] font-medium text-muted-foreground group-hover/quick:text-foreground transition-colors">
        {label}
      </span>
    </button>
  );
};
