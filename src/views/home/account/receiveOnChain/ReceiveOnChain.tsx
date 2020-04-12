import React, { useState, useEffect } from 'react';
import {
  NoWrapTitle,
  DarkSubTitle,
  OverflowText,
  ResponsiveLine,
} from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ADDRESS } from '../../../../graphql/mutation';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { useSize } from '../../../../hooks/UseSize';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../../../components/buttons/multiButton/MultiButton';
import { mediaDimensions } from '../../../../styles/Themes';

const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

const TitleWithSpacing = styled(NoWrapTitle)`
  margin-right: 10px;
`;

export const ReceiveOnChainCard = () => {
  const { width } = useSize();

  const [nested, setNested] = useState(false);
  const [received, setReceived] = useState(false);

  const [createAddress, { data, loading }] = useMutation(CREATE_ADDRESS, {
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    data && data.createAddress && setReceived(true);
  }, [data]);

  return (
    <>
      {data && data.createAddress ? (
        <>
          <ResponsiveLine>
            <DarkSubTitle>New Address:</DarkSubTitle>
            <OverflowText>{data.createAddress}</OverflowText>
            <CopyToClipboard
              text={data.createAddress}
              onCopy={() => toast.success('Address Copied')}
            >
              <ColorButton
                fullWidth={width <= mediaDimensions.mobile}
                arrow={true}
                withMargin={
                  width <= mediaDimensions.mobile ? '8px 0 0' : '0 0 0 16px'
                }
              >
                Copy
              </ColorButton>
            </CopyToClipboard>
          </ResponsiveLine>
        </>
      ) : (
        <ResponsiveLine>
          <ButtonRow>
            <TitleWithSpacing>Type of Address:</TitleWithSpacing>
            <MultiButton>
              <SingleButton
                selected={!nested}
                onClick={() => {
                  setNested(false);
                }}
              >
                P2WPKH
              </SingleButton>
              <SingleButton
                selected={nested}
                onClick={() => {
                  setNested(true);
                }}
              >
                NP2WPKH
              </SingleButton>
            </MultiButton>
          </ButtonRow>
          <SecureButton
            callback={createAddress}
            variables={{ nested }}
            disabled={received}
            withMargin={
              width <= mediaDimensions.mobile ? '16px 0 0' : '0 0 0 16px'
            }
            arrow={true}
            loading={loading}
            fullWidth={width <= mediaDimensions.mobile}
          >
            Create Address
          </SecureButton>
        </ResponsiveLine>
      )}
    </>
  );
};
