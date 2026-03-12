import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useChartColors } from '../../lib/chart-colors';
import { useNavigate } from 'react-router-dom';
import { Link } from '../../components/link/Link';
import {
  GetServerAccountsQuery,
  useGetServerAccountsQuery,
} from '../../graphql/queries/__generated__/getServerAccounts.generated';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { useLogoutMutation } from '../../graphql/mutations/__generated__/logout.generated';
import { useGetNodeInfoLazyQuery } from '../../graphql/queries/__generated__/getNodeInfo.generated';
import {
  Card,
  SingleLine,
  DarkSubTitle,
  Sub4Title,
  Separation,
} from '../../components/generic/Styled';
import { Button } from '@/components/ui/button';
import { cn } from '../../lib/utils';
import { Login } from './Login';

type ServerAccount = GetServerAccountsQuery['getServerAccounts'][0];

const RenderIntro = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <div className="w-full bg-transparent max-w-[1000px] mx-auto px-4 lg:px-0">
      <div className="w-full text-lg pb-2 text-white">
        Hi! Welcome to ThunderHub
      </div>
      <Card>
        {'To start you must create an account on your server. '}
        <Link
          newTab={true}
          href={'https://docs.thunderhub.io/setup/#server-accounts'}
        >
          You can find instructions for this here.
        </Link>
      </Card>
      <Card>
        <div
          className="flex items-center w-full justify-between cursor-pointer"
          onClick={() => setDetailsOpen(p => !p)}
        >
          <DarkSubTitle>{'Did you already create accounts?'}</DarkSubTitle>
          {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {detailsOpen && (
          <>
            <Separation />
            <Sub4Title>
              The accounts might be missing information that is needed for them
              to be available. Please check your logs to see if there is
              anything missing.
            </Sub4Title>
            <Sub4Title>
              On server start you will see a log message of the accounts that
              will be available.
            </Sub4Title>
          </>
        )}
      </Card>
    </div>
  );
};

export const Accounts = () => {
  const chartColors = useChartColors();
  const navigate = useNavigate();
  const [newAccount, setNewAccount] = useState<ServerAccount | null>(null);

  const [logout] = useLogoutMutation({ refetchQueries: ['GetServerAccounts'] });

  const { data: accountData, loading: loadingData } =
    useGetServerAccountsQuery();

  const [getCanConnect, { data, loading }] = useGetNodeInfoLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Unable to connect to this node');
      logout();
    },
  });

  useEffect(() => {
    if (!loading && data && data.getNodeInfo) {
      navigate('/');
    }
  }, [data, loading, navigate]);

  if (loadingData) {
    return (
      <div className="w-full bg-transparent max-w-[1000px] mx-auto px-4 lg:px-0">
        <LoadingCard />
      </div>
    );
  }

  if (!accountData?.getServerAccounts?.length) {
    return <RenderIntro />;
  }

  const getTitle = (account: ServerAccount) => {
    const { type, name, loggedIn } = account;

    const props = {
      color: chartColors.green,
      size: 14,
    };
    return (
      <div className="flex items-center">
        {type === 'sso' ? 'SSO Account' : name}
        <span className="ml-1">
          {loggedIn ? <Unlock {...props} /> : <Lock {...props} />}
        </span>
      </div>
    );
  };

  const getButtonTitle = (account: ServerAccount): string => {
    if (account.loggedIn) {
      return 'Connect';
    }
    return 'Login';
  };

  const getArrow = (account: ServerAccount): boolean => {
    if (account.loggedIn) {
      return false;
    }
    return true;
  };

  const handleClick = (account: ServerAccount) => () => {
    if (account.type === 'sso') {
      getCanConnect();
    } else if (account.type === 'server' && account.loggedIn) {
      getCanConnect();
    } else {
      setNewAccount(account);
    }
  };

  return (
    <>
      {newAccount && <Login account={newAccount} />}
      <div className="w-full bg-transparent max-w-[1000px] mx-auto px-4 lg:px-0">
        <div className={cn('w-full text-lg pb-2', !newAccount && 'text-white')}>
          {!newAccount ? 'Accounts' : 'Other Accounts'}
        </div>
        <Card>
          {accountData?.getServerAccounts?.map((account, index) => {
            if (!account) return null;
            const isThisLoading = newAccount?.id === account.id && loading;
            return (
              <div className="my-2" key={`${account.id}-${index}`}>
                <SingleLine>
                  {getTitle(account)}
                  <Button
                    variant="outline"
                    onClick={handleClick(account)}
                    disabled={newAccount?.id === account.id || loading}
                  >
                    {isThisLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        {getButtonTitle(account)}{' '}
                        {getArrow(account) && <ChevronRight size={18} />}
                      </>
                    )}
                  </Button>
                </SingleLine>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
};
