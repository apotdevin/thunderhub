import * as React from 'react';
import styled from 'styled-components';
import {
  useDecodeRequestQuery,
  useGetNodeQuery,
} from '../../../../generated/graphql';
import {
  SingleLine,
  SubTitle,
  Separation,
  DarkSubTitle,
} from '../../../../components/generic/Styled';
import { Price } from '../../../../components/price/Price';
import {
  renderLine,
  getNodeLink,
  getDateDif,
  getFormatDate,
} from '../../../../components/generic/helpers';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { Input } from '../../../../components/input/Input';

export const WithMargin = styled.div`
  margin-right: 4px;
`;

export const Centered = styled.div`
  text-align: center;
`;

interface DecodeProps {
  request: string;
  auth: {};
}

export const RequestModal: React.FC<DecodeProps> = ({
  children,
  request,
  auth,
}) => {
  const { data, loading, error } = useDecodeRequestQuery({
    variables: { auth, request },
  });

  if (error) {
    return (
      <Centered>
        <SubTitle>Error decoding the Invoice</SubTitle>
        <DarkSubTitle>
          Please verify you have correctly copied the Invoice.
        </DarkSubTitle>
      </Centered>
    );
  }

  if (loading || !data || !data.decodeRequest) {
    return <LoadingCard noCard={true} />;
  }

  const { description, destination, expires_at, tokens } = data.decodeRequest;

  return (
    <>
      <SingleLine>
        <SubTitle>Pay Invoice</SubTitle>
        <Price amount={tokens} />
      </SingleLine>
      <Separation />
      {renderLine('Description:', description)}
      {renderLine('Destination:', getNodeLink(destination))}
      {renderLine(
        'Expires in:',
        `${getDateDif(expires_at)} (${getFormatDate(expires_at)})`
      )}
      {children}
    </>
  );
};

interface KeysendProps {
  tokens: number;
  auth: {};
  publicKey: string;
  setTokens: (amount: number) => void;
}

export const KeysendModal: React.FC<KeysendProps> = ({
  children,
  auth,
  publicKey,
  tokens,
  setTokens,
}) => {
  const { data, loading, error } = useGetNodeQuery({
    variables: { auth, publicKey },
  });
  if (error) {
    return (
      <Centered>
        <SubTitle>Error getting node with that public key.</SubTitle>
        <DarkSubTitle>
          Please verify you copied the public key correctly.
        </DarkSubTitle>
      </Centered>
    );
  }
  if (loading || !data || !data.getNode) {
    return <LoadingCard noCard={true} />;
  }

  const { alias } = data.getNode;

  return (
    <>
      <SingleLine>
        <SubTitle>Pay Node</SubTitle>
        <div>{alias}</div>
      </SingleLine>
      <Separation />
      <SingleLine>
        <SingleLine>
          <WithMargin>Sats:</WithMargin>
          <DarkSubTitle>
            <Price amount={tokens} />
          </DarkSubTitle>
        </SingleLine>
        <Input
          placeholder={'Sats'}
          withMargin={'0 0 0 8px'}
          type={'number'}
          onChange={e => setTokens(Number(e.target.value))}
        />
      </SingleLine>
      <DarkSubTitle withMargin={'16px 0'}>
        Remember Keysend is an experimental feature. Use at your own risk.
      </DarkSubTitle>
      {children}
    </>
  );
};
