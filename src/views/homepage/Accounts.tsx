import * as React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getAuthObj } from 'src/utils/auth';
import { Lock } from 'react-feather';
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
import { Section } from '../../components/section/Section';
import { Card, SingleLine } from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { ConnectTitle, LockPadding } from './HomePage.styled';

const AccountLine = styled.div`
  margin: 8px 0;
`;

const TypeText = styled.div`
  font-size: 14px;
  margin-right: 8px;
`;

export const Accounts = () => {
  const { push } = useRouter();
  const dispatchStatus = useStatusDispatch();
  const [newAccount, setNewAccount] = React.useState();

  const { session, accounts, activeAccount, account } = useAccountState();
  const dispatch = useAccountDispatch();

  const colorChange = account && account.type === CLIENT_ACCOUNT;

  const change =
    !session &&
    account &&
    account.type === CLIENT_ACCOUNT &&
    account.admin !== '' &&
    account.viewOnly === '';

  const [getCanConnect, { data, loading }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Unable to connect to this node');
    },
  });

  React.useEffect(() => {
    if (!loading && data?.getNodeInfo && newAccount) {
      dispatch({ type: 'changeAccount', changeId: newAccount });
      dispatchStatus({ type: 'connected' });
      push(appendBasePath('/home'));
    }
  }, [data, loading, newAccount, dispatch, push, dispatchStatus]);

  if (
    accounts.length <= 1 &&
    accounts.filter(a => a.type !== CLIENT_ACCOUNT).length < 1
  ) {
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
    const { type, name } = account;
    if (type !== CLIENT_ACCOUNT) {
      return (
        <div>
          {type === SSO_ACCOUNT ? 'SSO Account' : name}
          <LockPadding>
            <Lock color={chartColors.green} size={14} />
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
        variables: { auth: { type: SSO_ACCOUNT } },
      });
    } else if (type === SERVER_ACCOUNT && loggedIn) {
      setNewAccount(id);
      getCanConnect({
        variables: { auth: { type: SERVER_ACCOUNT } },
      });
    } else {
      dispatch({ type: 'changeAccount', changeId: id });
    }
  };

  return (
    <Section withColor={false}>
      <ConnectTitle change={!colorChange}>
        {!change ? 'Accounts' : 'Other Accounts'}
      </ConnectTitle>
      <Card>
        {accounts.map((account, index) => {
          if (account.id === activeAccount && !change) {
            return;
          }
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
