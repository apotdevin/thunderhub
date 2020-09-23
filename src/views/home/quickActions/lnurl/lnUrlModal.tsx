import { FC, useEffect } from 'react';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { Separation } from 'src/components/generic/Styled';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { Title } from 'src/components/typography/Styled';
import { useFetchLnUrlMutation } from 'src/graphql/mutations/__generated__/lnUrl.generated';
import styled from 'styled-components';
import { LnPay } from './LnPay';
import { LnWithdraw } from './LnWithdraw';

const ModalText = styled.div`
  width: 100%;
  text-align: center;
`;

type lnUrlProps = {
  url: string;
  type?: string;
};

export const LnUrlModal: FC<lnUrlProps> = ({ url, type }) => {
  const fullUrl = new URL(url);

  const [fetchLnUrl, { data, loading }] = useFetchLnUrlMutation();

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

  return (
    <>
      <Title>Login</Title>
      <Separation />
      <ModalText>{`Login to ${fullUrl.host}`}</ModalText>;
      <ColorButton fullWidth={true} withMargin={'32px 0 0'}>
        Confirm
      </ColorButton>
    </>
  );
};
