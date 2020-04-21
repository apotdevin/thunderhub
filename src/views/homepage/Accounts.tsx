import * as React from 'react';
import { useAccount } from '../../context/AccountContext';
import { Section } from '../../components/section/Section';
import { Card, SubCard, SingleLine } from '../../components/generic/Styled';
import styled from 'styled-components';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { useGetCanConnectLazyQuery } from '../../generated/graphql';
import { toast } from 'react-toastify';

const ConnectTitle = styled.div`
  width: 100%;
  font-size: 18px;
  padding-bottom: 8px;
`;

const AccountLine = styled.div`
  margin: 8px 0;
`;

const TypeText = styled.div`
  font-size: 14px;
  margin-right: 8px;
`;

export const Accounts = () => {
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
  }, [data, loading, newAccount]);

  if (accounts.length <= 1) {
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
      <ConnectTitle>{'Other Accounts'}</ConnectTitle>
      <Card>
        {accounts.map((account, index) => {
          if (account.id === id) {
            return;
          }
          return (
            <AccountLine key={`${account.id}-${index}`}>
              <SingleLine>
                {account.name}
                <SingleLine>
                  <TypeText>{isType(account.admin, account.viewOnly)}</TypeText>
                  <ColorButton
                    onClick={handleClick(account)}
                    arrow={account.viewOnly ? false : true}
                    loading={newAccount === account.id && loading}
                    disabled={loading}
                  >
                    {account.viewOnly ? 'Connect' : 'Login'}
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
