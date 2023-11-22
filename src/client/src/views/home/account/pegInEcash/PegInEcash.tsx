import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import CopyToClipboard from 'react-copy-to-clipboard';
import { QRCodeSVG } from 'qrcode.react';
import { Copy } from 'react-feather';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { mediaWidths } from '../../../../styles/Themes';
import { SmallSelectWithValue } from '../../../../components/select';
import {
  ResponsiveLine,
  SubTitle,
} from '../../../../components/generic/Styled';
import { Federation } from '../../../../api/types';
import { gatewayApi } from '../../../../api/GatewayApi';
import { useGatewayFederations } from '../../../../hooks/UseGatewayFederations';

const S = {
  row: styled.div`
    display: grid;
    align-items: center;
    gap: 16px;
    grid-template-columns: 1fr 2fr;

    @media (${mediaWidths.mobile}) {
      width: 100%;
      display: block;
    }
  `,
};

const Responsive = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
`;

const WrapRequest = styled.div`
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
  margin: 24px;
  font-size: 14px;
`;

const QRWrapper = styled.div`
  width: 280px;
  height: 280px;
  margin: 16px;
  background: white;
  padding: 16px;
`;

const Column = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const PegInEcashCard = () => {
  const federations: Federation[] = useGatewayFederations();
  const [selectedFederation, setSelectedFederation] =
    useState<Federation | null>(null);
  const [address, setAddress] = useState('');

  const handleFetchPegInAddress = () => {
    if (!selectedFederation) return;
    gatewayApi.fetchAddress(selectedFederation.federation_id).then(address => {
      setAddress(address);
    });
  };

  return (
    <>
      {address !== '' ? (
        <Responsive>
          <QRWrapper>
            <QRCodeSVG value={address} size={248} />
          </QRWrapper>
          <Column>
            <WrapRequest>{address}</WrapRequest>
            <CopyToClipboard
              text={address}
              onCopy={() => toast.success('Address Copied')}
            >
              <ColorButton>
                <Copy size={18} />
                Copy
              </ColorButton>
            </CopyToClipboard>
          </Column>
        </Responsive>
      ) : (
        <>
          <ResponsiveLine>
            <S.row>
              <SubTitle>Into Federation:</SubTitle>
              {federations.length > 0 && (
                <SmallSelectWithValue
                  callback={e => setSelectedFederation(e[0] as any)}
                  options={federations.map(f => ({
                    label:
                      f.config.meta.federation_name ||
                      'No connected Federations',
                    value: f.federation_id || 'No connected Federations',
                  }))}
                  value={{
                    label:
                      federations[0].config.meta.federation_name ||
                      'No connected Federations',
                    value:
                      federations[0].federation_id ||
                      'No connected Federations',
                  }}
                  isClearable={false}
                />
              )}
            </S.row>
            <ColorButton
              onClick={() => handleFetchPegInAddress()}
              disabled={false}
              withMargin={'0 0 0 16px'}
              mobileMargin={'16px 0 0'}
              arrow={true}
              mobileFullWidth={true}
            >
              Create Peg In Address
            </ColorButton>
          </ResponsiveLine>
        </>
      )}
    </>
  );
};
