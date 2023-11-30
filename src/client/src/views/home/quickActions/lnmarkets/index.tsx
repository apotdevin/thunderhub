import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Activity } from 'react-feather';
import { toast } from 'react-toastify';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import {
  useConfigDispatch,
  useConfigState,
} from '../../../../context/ConfigContext';
import { useLnMarketsLoginMutation } from '../../../../graphql/mutations/__generated__/lnMarkets.generated';
import { useGetLnMarketsStatusQuery } from '../../../../graphql/queries/__generated__/getLnMarketsStatus.generated';
import { getErrorContent } from '../../../../utils/error';
import getConfig from 'next/config';
import { QuickCard, QuickTitle } from '../MainnetQuickActions';

const { publicRuntimeConfig } = getConfig();
const { disableLnMarkets } = publicRuntimeConfig;

export const LnMarketsCard = () => {
  const { push } = useRouter();
  const dispatch = useConfigDispatch();
  const { lnMarketsAuth } = useConfigState();

  const { data: statusData } = useGetLnMarketsStatusQuery({
    fetchPolicy: 'no-cache',
    skip: disableLnMarkets,
  });
  const [login, { data, loading }] = useLnMarketsLoginMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (statusData?.getLnMarketsStatus === 'in') {
      dispatch({ type: 'change', lnMarketsAuth: true });
    }
  }, [statusData, dispatch]);

  useEffect(() => {
    if (data?.lnMarketsLogin?.status === 'OK') {
      dispatch({ type: 'change', lnMarketsAuth: true });
      push('/lnmarkets');
    }
  }, [data, push, dispatch]);

  if (disableLnMarkets) {
    return null;
  }

  if (loading) {
    return (
      <QuickCard>
        <LoadingCard noCard={true} />
      </QuickCard>
    );
  }

  if (lnMarketsAuth) {
    return (
      <QuickCard onClick={() => push('/lnmarkets')}>
        <Activity size={24} />
        <QuickTitle>LnMarkets</QuickTitle>
      </QuickCard>
    );
  }

  return (
    <QuickCard onClick={() => login()}>
      <Activity size={24} />
      <QuickTitle>LnMarkets Login</QuickTitle>
    </QuickCard>
  );
};
