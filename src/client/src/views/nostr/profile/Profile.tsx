import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Radio, Copy, X } from 'react-feather';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { renderLine } from '../../../components/generic/helpers';
import { useGetNodeInfoQuery } from '../../../graphql/queries/__generated__/getNodeInfo.generated';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import {
  CardWithTitle,
  CardTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { mediaWidths, themeColors } from '../../../styles/Themes';

const Key = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;

  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  word-break: break-all;
`;

const Responsive = styled(SingleLine)`
  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
`;

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: ${({ startTile }: { startTile?: boolean }) =>
    startTile ? 'flex-start' : 'flex-end'};

  @media (${mediaWidths.mobile}) {
    margin: 16px 0;
  }
`;

const TextPadding = styled.span`
  margin-left: 5px;
`;

const ButtonRow = styled.div`
  display: flex;

  @media (${mediaWidths.mobile}) {
    width: 100%;
  }
`;

export const Profile = () => {
  const [open, openSet] = useState<boolean>(false);

  const { loading, data } = useGetNodeInfoQuery({
    ssr: false,
    onError: error => toast.error(getErrorContent(error)),
  });
  // const { loading, data } = useGetNostrProfile({
  //   ssr: false,
  //   onError: error => toast.error(getErrorContent(error)),
  // });

  if (!data || loading) {
    return <LoadingCard title={'Connect'} />;
  }

  const { public_key, uris } = data.getNodeInfo || {};

  const onionAddress = uris.find((uri: string) => uri.indexOf('onion') >= 0);
  const normalAddress = uris.find((uri: string) => uri.indexOf('onion') < 0);

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Nostr Profile</SubTitle>
      </CardTitle>
      <Card>
        <Responsive>
          <Radio size={18} color={themeColors.blue2} />
          <Tile startTile={true}>
            <DarkSubTitle>npub</DarkSubTitle>
            <Key>{public_key}</Key>
          </Tile>
          <ButtonRow>
            {onionAddress ? (
              <CopyToClipboard
                text={onionAddress}
                onCopy={() => toast.success('Onion Address Copied')}
              >
                <ColorButton fullWidth={true} withMargin={'0 4px 0 0'}>
                  <Copy size={18} />
                  <TextPadding>Onion</TextPadding>
                </ColorButton>
              </CopyToClipboard>
            ) : null}
            {normalAddress ? (
              <CopyToClipboard
                text={normalAddress}
                onCopy={() => toast.success('Public Address Copied')}
              >
                <ColorButton fullWidth={true} withMargin={'0 0 0 4px'}>
                  <Copy size={18} />
                </ColorButton>
              </CopyToClipboard>
            ) : null}
            <ColorButton
              fullWidth={true}
              withMargin={'0 0 0 8px'}
              onClick={() => openSet(s => !s)}
            >
              {open ? <X size={18} /> : 'Details'}
            </ColorButton>
          </ButtonRow>
        </Responsive>
        {open && (
          <>
            <Separation />
            {renderLine('npub', `npub${public_key}`)}
            {renderLine('nostr pubkey', `${public_key}`)}
            {renderLine('Signature', 'thisisanattesstation')}
            {renderLine('Identity Pubkey', public_key)}
          </>
        )}
      </Card>
    </CardWithTitle>
  );
};
