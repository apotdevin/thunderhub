import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useCreateAddressMutation } from 'src/graphql/mutations/__generated__/createAddress.generated';
import {
  NoWrapTitle,
  DarkSubTitle,
  OverflowText,
  ResponsiveLine,
} from '../../../../components/generic/Styled';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../../../components/buttons/multiButton/MultiButton';

const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

const TitleWithSpacing = styled(NoWrapTitle)`
  margin-right: 10px;
`;

export const ReceiveOnChainCard = () => {
  const [nested, setNested] = useState(false);
  const [received, setReceived] = useState(false);

  const [createAddress, { data, loading }] = useCreateAddressMutation({
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
                arrow={true}
                withMargin={'0 0 0 16px'}
                mobileMargin={'16px 0 0'}
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
            withMargin={'0 0 0 16px'}
            mobileMargin={'16px 0 0'}
            arrow={true}
            loading={loading}
            mobileFullWidth={true}
          >
            Create Address
          </SecureButton>
        </ResponsiveLine>
      )}
    </>
  );
};
