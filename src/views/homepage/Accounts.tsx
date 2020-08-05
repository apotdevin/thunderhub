import * as React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Lock, Unlock } from 'react-feather';
import { chartColors } from 'src/styles/Themes';
import { useRouter } from 'next/router';
import { useGetCanConnectLazyQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { Link } from 'src/components/link/Link';
import { useGetServerAccountsQuery } from 'src/graphql/queries/__generated__/getServerAccounts.generated';
import { ServerAccountType } from 'src/graphql/types';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { Section } from '../../components/section/Section';
import { Card, SingleLine } from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { ConnectTitle, LockPadding } from './HomePage.styled';
import { Login } from './Login';

const AccountLine = styled.div`
  margin: 8px 0;
`;

const renderIntro = () => (
  <Section color={'transparent'}>
    <ConnectTitle changeColor={true}>Hi! Welcome to ThunderHub</ConnectTitle>
    <Card>
      {'To start you must create an account on your server. '}
      <Link
        newTab={true}
        href={'https://github.com/apotdevin/thunderhub#server-accounts'}
      >
        You can find instructions for this here.
      </Link>
    </Card>
  </Section>
);

export const Accounts = () => {
  const { push } = useRouter();
  const [newAccount, setNewAccount] = React.useState<ServerAccountType | null>(
    null
  );

  const {
    data: accountData,
    loading: loadingData,
  } = useGetServerAccountsQuery();

  const [getCanConnect, { data, loading }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Unable to connect to this node');
    },
  });

  React.useEffect(() => {
    if (!loading && data && data.getNodeInfo) {
      push('/home');
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
    return renderIntro();
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
