import React, { useEffect } from 'react';
import styled from 'styled-components';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { UserInfo } from '../src/views/lnmarkets/UserInfo';
import { Title } from '../src/components/typography/Styled';
import { GoToLnMarkets } from '../src/views/lnmarkets/GoToLnMarkets';
import { DepositWithdraw } from '../src/views/lnmarkets/DepositWithdraw';
import { useGetLnMarketsStatusQuery } from '../src/graphql/queries/__generated__/getLnMarketsStatus.generated';
import {
  useLnMarketsLoginMutation,
  useLnMarketsLogoutMutation,
} from '../src/graphql/mutations/__generated__/lnMarkets.generated';
import { getErrorContent } from '../src/utils/error';
import { toast } from 'react-toastify';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { useConfigDispatch } from '../src/context/ConfigContext';
import { SingleLine } from '../src/components/generic/Styled';

export const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

export const SettingsLine = styled(SingleLine)`
  margin: 8px 0;
`;

const LnMarketsView = () => {
  const dispatch = useConfigDispatch();

  const { data: statusData } = useGetLnMarketsStatusQuery({
    fetchPolicy: 'no-cache',
  });

  const [login, { data, loading }] = useLnMarketsLoginMutation({
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: ['GetLnMarketsStatus'],
  });

  const [logout, { loading: logoutLoading }] = useLnMarketsLogoutMutation({
    onCompleted: () => {
      toast.success('Logged out');
      dispatch({ type: 'change', lnMarketsAuth: false });
    },
    refetchQueries: ['GetLnMarketsStatus'],
  });

  useEffect(() => {
    if (data?.lnMarketsLogin?.status === 'OK') {
      dispatch({ type: 'change', lnMarketsAuth: true });
      toast.success('Logged In');
    }
  }, [data, dispatch]);

  const Content = () => {
    if (statusData?.getLnMarketsStatus === 'out') {
      return (
        <ColorButton
          loading={loading}
          disabled={loading}
          withMargin={'8px 0 0 '}
          fullWidth={true}
          onClick={login}
        >
          Login
        </ColorButton>
      );
    }

    return (
      <>
        <UserInfo />
        <DepositWithdraw />
        <GoToLnMarkets />
        <ColorButton
          loading={logoutLoading}
          disabled={logoutLoading}
          withMargin={'8px 0 0 '}
          fullWidth={true}
          onClick={logout}
        >
          Logout
        </ColorButton>
      </>
    );
  };

  return (
    <>
      <Title>LnMarkets</Title>
      <Content />
    </>
  );
};

const Wrapped = () => (
  <GridWrapper noNavigation={true}>
    <LnMarketsView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
