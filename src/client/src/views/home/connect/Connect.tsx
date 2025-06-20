import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Radio, Copy, X, Check } from 'react-feather';
import styled from 'styled-components';
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
import useCopyClipboard from '../../../hooks/UseCopyToClipboard';

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

const Tile = styled.div<{ startTile?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: ${({ startTile }) => (startTile ? 'flex-start' : 'flex-end')};

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

export const ConnectCard = () => {
  const [open, openSet] = useState<boolean>(false);

  const { loading, data } = useGetNodeInfoQuery({
    ssr: false,
    onError: error => toast.error(getErrorContent(error)),
  });

  const [isCopied, copy] = useCopyClipboard({ successDuration: 1000 });

  if (!data || loading) {
    return <LoadingCard title={'Connect'} />;
  }

  const { public_key, uris } = data.getNodeInfo || {};

  const onionAddress = uris.find((uri: string) => uri.indexOf('onion') >= 0);
  const normalAddress = uris.find((uri: string) => uri.indexOf('onion') < 0);

  let clear: string | null = null;
  let tor: string | null = null;

  if (normalAddress) {
    clear = normalAddress.split('@')[1];
  }
  if (onionAddress) {
    tor = onionAddress.split('@')[1];
  }

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Connect</SubTitle>
      </CardTitle>
      <Card>
        <Responsive>
          <Radio size={18} color={themeColors.blue2} />
          <Tile startTile={true}>
            <DarkSubTitle>Public Key</DarkSubTitle>
            <Key>{public_key}</Key>
          </Tile>
          <ButtonRow>
            {onionAddress ? (
              <ColorButton
                fullWidth={true}
                withMargin={'0 4px 0 0'}
                onClick={() => copy(onionAddress)}
              >
                {isCopied ? <Check size={18} /> : <Copy size={18} />}
                <TextPadding>Onion</TextPadding>
              </ColorButton>
            ) : null}
            {normalAddress ? (
              <ColorButton
                fullWidth={true}
                withMargin={'0 0 0 4px'}
                onClick={() => copy(normalAddress)}
              >
                {isCopied ? <Check size={18} /> : <Copy size={18} />}
              </ColorButton>
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
            {renderLine('Public Key', public_key)}
            {clear && renderLine('IP', clear)}
            {tor && renderLine('TOR', tor)}
          </>
        )}
      </Card>
    </CardWithTitle>
  );
};
