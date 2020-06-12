import * as React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getAuthObj } from 'src/utils/auth';
import { Lock, Unlock } from 'react-feather';
import { chartColors } from 'src/styles/Themes';
import {
  useAccountState,
  CLIENT_ACCOUNT,
  useAccountDispatch,
  SSO_ACCOUNT,
  SERVER_ACCOUNT,
} from 'src/context/AccountContext';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';
import { useStatusDispatch } from 'src/context/StatusContext';
import { useGetCanConnectLazyQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { Link } from 'src/components/link/Link';
import { clientEnv } from 'server/utils/appEnv';
import { Section } from '../../components/section/Section';
import { Card, SingleLine } from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { dontShowSessionLogin } from '../login/helpers';
import { ConnectTitle, LockPadding } from './HomePage.styled';

const { noClient } = clientEnv;

const AccountLine = styled.div`
  margin: 8px 0;
`;

const TypeText = styled.div`
  font-size: 14px;
  margin-right: 8px;
`;

const renderIntro = () => (
  <Section withColor={false}>
    <ConnectTitle change={true}>Hi! Welcome to ThunderHub</ConnectTitle>
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
  const dispatchStatus = useStatusDispatch();
  const [newAccount, setNewAccount] = React.useState();

  const { accounts, activeAccount, account } = useAccountState();
  const dispatch = useAccountDispatch();

  const [getCanConnect, { data, loading }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Unable to connect to this node');
    },
  });

  React.useEffect(() => {
    if (!loading && data && data.getNodeInfo && newAccount) {
      dispatch({ type: 'changeAccount', changeId: newAccount });
      dispatchStatus({ type: 'connected' });
      push(appendBasePath('/home'));
    }
  }, [data, loading, newAccount, dispatch, push, dispatchStatus]);

  const change = accounts.length > 0 && dontShowSessionLogin(account);

  if (accounts.length <= 0) {
    if (noClient) {
      return renderIntro();
    }
    return null;
  }

  const filteredAccounts = accounts.filter(a => {
    if (a.type === CLIENT_ACCOUNT) {
      if (noClient) {
        return false;
      }
      if (a.id === activeAccount && !a.viewOnly) {
        return false;
      }
    }
    if (a.type === SERVER_ACCOUNT) {
      if (a.id === activeAccount && !a.loggedIn) {
        return false;
      }
    }
    return true;
  });

  if (filteredAccounts.length < 1) {
    if (noClient) {
      return renderIntro();
    }
    return null;
  }

  const isType = (admin: string, viewOnly: string): string => {
    if (!admin && viewOnly) {
      return '(View Only)';
    }
    if (admin && !viewOnly) {
      return '(Admin Only)';
    }
    return null;
  };

  const getTitle = account => {
    const { type, name, loggedIn } = account;
    if (type !== CLIENT_ACCOUNT) {
      const props = {
        color: chartColors.green,
        size: 14,
      };
      return (
        <div>
          {type === SSO_ACCOUNT ? 'SSO Account' : name}
          <LockPadding>
            {loggedIn ? <Unlock {...props} /> : <Lock {...props} />}
          </LockPadding>
        </div>
      );
    }
    return name;
  };

  const getButtonTitle = (account): string => {
    if (account.viewOnly || account.type === SSO_ACCOUNT) {
      return 'Connect';
    }
    if (account.type === SERVER_ACCOUNT && account.loggedIn) {
      return 'Connect';
    }
    return 'Login';
  };

  const getArrow = (account): boolean => {
    if (account.viewOnly || account.type === SSO_ACCOUNT) {
      return false;
    }
    if (account.type === SERVER_ACCOUNT && account.loggedIn) {
      return false;
    }
    return true;
  };

  const handleClick = account => () => {
    const { id, viewOnly, cert, host, type, loggedIn } = account;
    if (viewOnly) {
      setNewAccount(id);
      getCanConnect({
        variables: { auth: getAuthObj(host, viewOnly, null, cert) },
      });
    } else if (type === SSO_ACCOUNT) {
      setNewAccount(id);
      getCanConnect({
        variables: { auth: { type: SSO_ACCOUNT, id } },
      });
    } else if (type === SERVER_ACCOUNT && loggedIn) {
      setNewAccount(id);
      getCanConnect({
        variables: { auth: { type: SERVER_ACCOUNT, id } },
      });
    } else {
      dispatch({ type: 'changeAccount', changeId: id });
    }
  };

  return (
    <Section withColor={false}>
      <ConnectTitle change={change}>
        {change ? 'Accounts' : 'Other Accounts'}
      </ConnectTitle>
      <Card>
        {filteredAccounts.map((account, index) => {
          return (
            <AccountLine key={`${account.id}-${index}`}>
              <SingleLine>
                {getTitle(account)}
                <SingleLine>
                  {account.type === CLIENT_ACCOUNT && (
                    <TypeText>
                      {isType(account.admin, account.viewOnly)}
                    </TypeText>
                  )}
                  <ColorButton
                    onClick={handleClick(account)}
                    arrow={getArrow(account)}
                    loading={newAccount === account.id && loading}
                    disabled={loading}
                  >
                    {getButtonTitle(account)}
                  </ColorButton>
                </SingleLine>
              </SingleLine>
            </AccountLine>
          );
        })}
      </Card>
    </Section>
  );
};
