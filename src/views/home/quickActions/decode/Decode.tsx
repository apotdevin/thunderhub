import React, { useState } from 'react';
import {
  Card,
  Sub4Title,
  Separation,
  ResponsiveLine,
} from '../../../../components/generic/Styled';
import {
  renderLine,
  getNodeLink,
} from '../../../../components/generic/Helpers';
import { useAccount } from '../../../../context/AccountContext';
import { getErrorContent } from '../../../../utils/error';
import { toast } from 'react-toastify';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { Input } from '../../../../components/input/Input';
import { Price } from '../../../../components/price/Price';
import { useDecodeRequestMutation } from '../../../../generated/graphql';

export const DecodeCard = ({ color }: { color: string }) => {
  const [request, setRequest] = useState('');

  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const [decode, { data, loading }] = useDecodeRequestMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  const renderData = () => {
    if (!data || !data.decodeRequest) return null;

    const {
      chainAddress,
      cltvDelta,
      description,
      descriptionHash,
      destination,
      expiresAt,
      id,
      tokens,
    } = data.decodeRequest;

    return (
      <>
        <Separation />
        {renderLine('Id:', id)}
        {renderLine('Destination:', getNodeLink(destination))}
        {renderLine('Description:', description)}
        {renderLine('Description Hash:', descriptionHash)}
        {renderLine('Chain Address:', chainAddress)}
        {renderLine('CLTV Delta:', cltvDelta)}
        {renderLine('Expires At:', expiresAt)}
        {renderLine('Amount:', <Price amount={tokens} />)}
      </>
    );
  };

  return (
    <Card bottom={'20px'}>
      <ResponsiveLine>
        <Sub4Title>Request:</Sub4Title>
        <Input
          placeholder={'Lightning Invoice'}
          withMargin={'0 0 0 24px'}
          mobileMargin={'0 0 16px'}
          color={color}
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
        <ColorButton
          color={color}
          disabled={request === ''}
          withMargin={'0 0 0 16px'}
          mobileMargin={'0'}
          arrow={true}
          loading={loading}
          mobileFullWidth={true}
          onClick={() => {
            setRequest('');
            decode({ variables: { request, auth } });
          }}
        >
          Decode
        </ColorButton>
      </ResponsiveLine>
      {renderData()}
    </Card>
  );
};
