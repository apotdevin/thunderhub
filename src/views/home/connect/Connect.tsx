import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useAccount } from '../../../context/AccountContext';
import { GET_CONNECT_INFO } from '../../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import {
  CardWithTitle,
  CardTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  ColorButton,
} from '../../../components/generic/Styled';
import { Radio, Copy } from '../../../components/generic/Icons';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { mediaWidths } from '../../../styles/Themes';

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

const sectionColor = '#fa541c';

export const ConnectCard = () => {
  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const { loading, data } = useQuery(GET_CONNECT_INFO, {
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard title={'Connect'} />;
  }

  const { public_key, uris } = data.getNodeInfo;

  const onionAddress = uris.find((uri: string) => uri.indexOf('onion') >= 0);
  const normalAddress = uris.find((uri: string) => uri.indexOf('onion') < 0);

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Connect</SubTitle>
      </CardTitle>
      <Card>
        <Responsive>
          <Radio color={sectionColor} />
          <Tile startTile={true}>
            <DarkSubTitle>Public Key</DarkSubTitle>
            <Key>{public_key}</Key>
          </Tile>
          <SingleLine>
            {onionAddress ? (
              <CopyToClipboard
                text={onionAddress}
                onCopy={() => toast.success('Onion Address Copied')}
              >
                <ColorButton color={sectionColor}>
                  <Copy />
                  <TextPadding>Onion</TextPadding>
                </ColorButton>
              </CopyToClipboard>
            ) : null}
            {normalAddress ? (
              <CopyToClipboard
                text={normalAddress}
                onCopy={() => toast.success('Public Address Copied')}
              >
                <ColorButton color={sectionColor}>
                  <Copy />
                </ColorButton>
              </CopyToClipboard>
            ) : null}
          </SingleLine>
        </Responsive>
      </Card>
    </CardWithTitle>
  );
};
