import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Separation } from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { Title } from '../../../../components/typography/Styled';
import { useFetchLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import { getErrorContent } from '../../../../utils/error';
import { LnChannel } from './LnChannel';
import { LnPay } from './LnPay';
import { LnWithdraw } from './LnWithdraw';

type lnUrlProps = {
  url: string;
  type?: string;
};

export const LnUrlModal: FC<lnUrlProps> = ({ url, type }) => {
  const fullUrl = new URL(url);

  const [fetchLnUrl, { data, loading }] = useFetchLnUrlMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!type) {
      fetchLnUrl({ variables: { url } });
    }
  }, [type, url, fetchLnUrl]);

  if (!type && !data) {
    return <LoadingCard noCard={true} />;
  }

  if (loading || !data) {
    return <LoadingCard noCard={true} />;
  }

  if (data?.fetchLnUrl?.__typename === 'PayRequest') {
    return <LnPay request={data.fetchLnUrl} />;
  }

  if (data?.fetchLnUrl?.__typename === 'WithdrawRequest') {
    return <LnWithdraw request={data.fetchLnUrl} />;
  }

  if (data?.fetchLnUrl?.__typename === 'ChannelRequest') {
    return <LnChannel request={data.fetchLnUrl} />;
  }

  return (
    <>
      <Title>Login</Title>
      <Separation />
      <div className="w-full text-center">{`Login to ${fullUrl.host}`}</div>;
      <Button
        variant="outline"
        className="w-full"
        style={{ margin: '32px 0 0' }}
      >
        Confirm
      </Button>
    </>
  );
};
