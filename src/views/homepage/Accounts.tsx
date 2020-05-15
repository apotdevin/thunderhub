import * as React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAccount } from '../../context/AccountContext';
import { Section } from '../../components/section/Section';
import { Card, SingleLine } from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { useGetCanConnectLazyQuery } from '../../generated/graphql';
import { ConnectTitle, LockPadding } from './HomePage.styled';
import { SSO_USER } from 'src/utils/auth';
import { Lock } from 'react-feather';
import { chartColors } from 'src/styles/Themes';

const AccountLine = styled.div`
  margin: 8px 0;
`;

const TypeText = styled.div`
  font-size: 14px;
  margin-right: 8px;
`;

export const Accounts = ({ change }: { change?: boolean }) => {
  const [newAccount, setNewAccount] = React.useState();
  const { id, changeAccount, accounts } = useAccount();

  const [getCanConnect, { data, loading }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Unable to connect to this node');
    },
  });

  React.useEffect(() => {
    if (!loading && data?.getNodeInfo && newAccount) {
      changeAccount(newAccount);
    }
  }, [data, loading, newAccount, changeAccount]);

  if (
    accounts.length <= 1 &&
    accounts.filter(a => a.name === SSO_USER).length < 1
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

  const getTitle = (name: string) => {
    if (name === SSO_USER) {
      return (
        <div>
          SSO Account
          <LockPadding>
            <Lock color={chartColors.green} size={14} />
          </LockPadding>
        </div>
      );
    }
    return name;
  };

  const getButtonTitle = account => {
    if (account.viewOnly || account.name === SSO_USER) {
      return 'Connect';
    }
    return 'Login';
  };

  const handleClick = account => () => {
    const { id, viewOnly, cert, host } = account;
    if (viewOnly) {
      setNewAccount(id);
      getCanConnect({
        variables: { auth: { host, macaroon: viewOnly, cert } },
      });
    } else {
      changeAccount(id);
    }
  };

  return (
    <Section withColor={false}>
      <ConnectTitle change={change}>
        {change ? 'Accounts' : 'Other Accounts'}
      </ConnectTitle>
      <Card>
        {accounts.map((account, index) => {
          if (account.id === id && !change) {
            return;
          }
          return (
            <AccountLine key={`${account.id}-${index}`}>
              <SingleLine>
                {getTitle(account.name)}
                <SingleLine>
                  <TypeText>{isType(account.admin, account.viewOnly)}</TypeText>
                  <ColorButton
                    onClick={handleClick(account)}
                    arrow={account.viewOnly ? false : true}
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
