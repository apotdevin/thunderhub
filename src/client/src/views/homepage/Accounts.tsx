import * as React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Lock, Unlock, ChevronDown, ChevronUp } from 'react-feather';
import { chartColors } from '../../styles/Themes';
import { useRouter } from 'next/router';
import { Link } from '../../components/link/Link';
import { useGetServerAccountsQuery } from '../../graphql/queries/__generated__/getServerAccounts.generated';
import { ServerAccountType } from '../../graphql/types';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { useLogoutMutation } from '../../graphql/mutations/__generated__/logout.generated';
import { useGetNodeInfoLazyQuery } from '../../graphql/queries/__generated__/getNodeInfo.generated';
import { Section } from '../../components/section/Section';
import {
  Card,
  SingleLine,
  DarkSubTitle,
  Sub4Title,
  Separation,
} from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { ConnectTitle, LockPadding } from './HomePage.styled';
import { Login } from './Login';

const AccountLine = styled.div`
  margin: 8px 0;
`;

const DetailsLine = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  cursor: pointer;
`;

const RenderIntro = () => {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  return (
    <Section color={'transparent'}>
      <ConnectTitle changeColor={true}>Hi! Welcome to ThunderHub</ConnectTitle>
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
        <DetailsLine onClick={() => setDetailsOpen(p => !p)}>
          <DarkSubTitle>{'Did you already create accounts?'}</DarkSubTitle>
          {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </DetailsLine>
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
    </Section>
  );
};

export const Accounts = () => {
  const { push, prefetch } = useRouter();
  const [newAccount, setNewAccount] = React.useState<ServerAccountType | null>(
    null
  );

  const [logout] = useLogoutMutation({ refetchQueries: ['GetServerAccounts'] });

  React.useEffect(() => {
    prefetch('/');
  }, [prefetch]);

  const { data: accountData, loading: loadingData } =
    useGetServerAccountsQuery();

  const [getCanConnect, { data, loading }] = useGetNodeInfoLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Unable to connect to this node');
      logout();
    },
  });

  React.useEffect(() => {
    if (!loading && data && data.getNodeInfo) {
      push('/');
    }
  }, [data, loading, push]);

  if (loadingData) {
    return (
      <Section color={'transparent'}>
        <LoadingCard />
      </Section>
    );
  }

  if (!accountData?.getServerAccounts?.length) {
    return <RenderIntro />;
  }

  const getTitle = (account: ServerAccountType) => {
    const { type, name, loggedIn } = account;

    const props = {
      color: chartColors.green,
      size: 14,
    };
    return (
      <div>
        {type === 'sso' ? 'SSO Account' : name}
        <LockPadding>
          {loggedIn ? <Unlock {...props} /> : <Lock {...props} />}
        </LockPadding>
      </div>
    );
  };

  const getButtonTitle = (account: ServerAccountType): string => {
    if (account.loggedIn) {
      return 'Connect';
    }
    return 'Login';
  };

  const getArrow = (account: ServerAccountType): boolean => {
    if (account.loggedIn) {
      return false;
    }
    return true;
  };

  const handleClick = (account: ServerAccountType) => () => {
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
      <Section color={'transparent'}>
        <ConnectTitle changeColor={!newAccount}>
          {!newAccount ? 'Accounts' : 'Other Accounts'}
        </ConnectTitle>
        <Card>
          {accountData?.getServerAccounts?.map((account, index) => {
            if (!account) return null;
            return (
              <AccountLine key={`${account.id}-${index}`}>
                <SingleLine>
                  {getTitle(account)}
                  <ColorButton
                    onClick={handleClick(account)}
                    arrow={getArrow(account)}
                    loading={newAccount?.id === account.id && loading}
                    disabled={newAccount?.id === account.id || loading}
                  >
                    {getButtonTitle(account)}
                  </ColorButton>
                </SingleLine>
              </AccountLine>
            );
          })}
        </Card>
      </Section>
    </>
  );
};
