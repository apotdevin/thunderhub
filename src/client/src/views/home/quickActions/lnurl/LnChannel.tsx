import { FC } from 'react';
import { ChannelRequest } from '../../../../graphql/types';
import styled from 'styled-components';
import { Title } from '../../../../components/typography/Styled';
import { Separation } from '../../../../components/generic/Styled';
import {
  getNodeLink,
  renderLine,
} from '../../../../components/generic/helpers';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { useChannelLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';

const ModalText = styled.div`
  width: 100%;
  text-align: center;
`;

type LnChannelProps = {
  request: ChannelRequest;
};

export const LnChannel: FC<LnChannelProps> = ({ request }) => {
  const { k1, callback, uri } = request;

  const split = uri?.split('@');

  const [channelLnUrl, { data, loading }] = useChannelLnUrlMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => toast.success(data.lnUrlChannel),
  });

  if (!callback || !k1 || !uri) {
    return <ModalText>Missing information from LN Service</ModalText>;
  }

  const callbackUrl = new URL(callback);

  return (
    <>
      <Title>Channel</Title>
      <Separation />
      <ModalText>{`Request from ${callbackUrl.host}`}</ModalText>
      <Separation />
      {split?.[0] && renderLine('Peer', getNodeLink(split[0]))}
      <Separation />
      <ColorButton
        loading={loading}
        disabled={loading || !!data?.lnUrlChannel}
        fullWidth={true}
        withMargin={'16px 0 0'}
        onClick={() => {
          channelLnUrl({ variables: { uri, k1, callback } });
        }}
      >
        {`Initiate Channel Request`}
      </ColorButton>
    </>
  );
};
