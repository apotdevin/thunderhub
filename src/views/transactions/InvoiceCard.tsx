import React from 'react';
import { InvoiceType } from 'src/graphql/types';
import {
  Separation,
  SubCard,
  SingleLine,
  ResponsiveLine,
  DarkSubTitle,
} from '../../components/generic/Styled';
import {
  StatusLine,
  NodeTitle,
  MainInfo,
} from '../../components/generic/CardGeneric';
import {
  getStatusDot,
  getDateDif,
  getFormatDate,
  renderLine,
} from '../../components/generic/helpers';
import { Price } from '../../components/price/Price';
import { MessageCircle } from 'react-feather';
import styled from 'styled-components';
import { themeColors } from 'src/styles/Themes';

const S = {
  icon: styled.span`
    margin-left: 4px;
  `,
};

interface InvoiceCardProps {
  invoice: InvoiceType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const InvoiceCard = ({
  invoice,
  index,
  setIndexOpen,
  indexOpen,
}: InvoiceCardProps) => {
  const {
    chain_address,
    confirmed_at,
    created_at,
    description,
    description_hash,
    expires_at,
    id,
    is_canceled,
    is_confirmed,
    is_held,
    is_private,
    secret,
    tokens,
    date,
    messages,
  } = invoice;

  const texts = messages.map(m => m?.message).filter(Boolean);
  const hasMessages = !!texts.length;

  const formatAmount = <Price amount={tokens} />;

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderMessages = () => (
    <>
      {texts.map(t => renderLine('Message', t))}
      <Separation />
    </>
  );

  const renderDetails = () => {
    return (
      <>
        <Separation />
        {hasMessages && renderMessages()}
        {is_confirmed &&
          renderLine(
            'Confirmed:',
            confirmed_at &&
              `${getDateDif(confirmed_at)} ago (${getFormatDate(confirmed_at)})`
          )}
        {renderLine(
          'Created:',
          `${getDateDif(created_at)} ago (${getFormatDate(created_at)})`
        )}
        {renderLine(
          'Expires:',
          `${getDateDif(expires_at)} ago (${getFormatDate(expires_at)})`
        )}
        {renderLine('Id:', id)}
        {renderLine('Chain Address:', chain_address)}
        {renderLine('Description Hash:', description_hash)}
        {renderLine('Is Canceled:', is_canceled ? 'True' : 'False')}
        {renderLine('Is Held:', is_held ? 'True' : 'False')}
        {renderLine('Is Private:', is_private ? 'True' : 'False')}
        {renderLine('Secret:', secret)}
      </>
    );
  };

  return (
    <SubCard key={index}>
      <MainInfo onClick={() => handleClick()}>
        <StatusLine>{getStatusDot(is_confirmed, 'active')}</StatusLine>
        <ResponsiveLine>
          <NodeTitle>
            {description ? description : 'Invoice'}
            {hasMessages && (
              <S.icon>
                <MessageCircle size={16} stroke={themeColors.blue2} />
              </S.icon>
            )}
          </NodeTitle>
          <DarkSubTitle>{`(${getDateDif(date)} ago)`}</DarkSubTitle>
          <SingleLine>{formatAmount}</SingleLine>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
