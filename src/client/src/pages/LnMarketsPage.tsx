import { useEffect } from 'react';
import styled from 'styled-components';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { UserInfo } from '../views/lnmarkets/UserInfo';
import { Title } from '../components/typography/Styled';
import { GoToLnMarkets } from '../views/lnmarkets/GoToLnMarkets';
import { DepositWithdraw } from '../views/lnmarkets/DepositWithdraw';
import { useGetLnMarketsStatusQuery } from '../graphql/queries/__generated__/getLnMarketsStatus.generated';
import {
  useLnMarketsLoginMutation,
  useLnMarketsLogoutMutation,
} from '../graphql/mutations/__generated__/lnMarkets.generated';
import { getErrorContent } from '../utils/error';
import { toast } from 'react-toastify';
import { ColorButton } from '../components/buttons/colorButton/ColorButton';
import { useConfigDispatch } from '../context/ConfigContext';
import { SingleLine } from '../components/generic/Styled';

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

const LnMarketsPage = () => (
  <GridWrapper>
    <LnMarketsView />
  </GridWrapper>
);

export default LnMarketsPage;
