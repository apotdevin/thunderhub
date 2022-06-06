import React, { FC, Fragment } from 'react';
import { InvoiceType } from '../../graphql/types';
import { MessageCircle } from 'react-feather';
import styled from 'styled-components';
import { mediaWidths, themeColors } from '../../styles/Themes';
import { useGetChannelQuery } from '../../graphql/queries/__generated__/getChannel.generated';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import {
  getStatusDot,
  getDateDif,
  getFormatDate,
  renderLine,
} from '../../components/generic/helpers';
import {
  StatusLine,
  NodeTitle,
  MainInfo,
} from '../../components/generic/CardGeneric';
import {
  Separation,
  SubCard,
  DarkSubTitle,
} from '../../components/generic/Styled';

const S = {
  icon: styled.span`
    margin-left: 4px;
  `,
  grid: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 3fr 2fr 1fr;

    @media (${mediaWidths.mobile}) {
      grid-template-columns: 1fr;
    }
  `,
};

interface InvoiceCardProps {
  invoice: InvoiceType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

const ChannelAlias: FC<{ id: string }> = ({ id }) => {
  const { data, loading, error } = useGetChannelQuery({
    variables: { id },
  });

  if (loading) {
    return <>{renderLine('Peer', <LoadingCard noCard={true} />)}</>;
  }

  if (error) {
    return <>{renderLine('Peer', 'Unknown')}</>;
  }

  const alias =
    data?.getChannel.partner_node_policies?.node?.node?.alias || 'Unknown';

  return <>{renderLine('Peer', alias)}</>;
};

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
    payments,
  } = invoice;

  const inChannels = payments.map(p => p?.in_channel).filter(Boolean);
  const hasChannels = !!inChannels.length;

  const texts = payments.map(p => p?.messages?.message).filter(Boolean);
  const hasMessages = !!texts.length;

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderMessages = () => (
    <>
      {texts.map((t, index) => (
        <Fragment key={`${index}-${t}`}>{renderLine('Message', t)}</Fragment>
      ))}
      <Separation />
    </>
  );

  const renderInChannels = () => (
    <>
      {inChannels.map((t, index) => (
        <Fragment key={`${index}-${t}`}>
          {renderLine('In Through', t)}
          {t && <ChannelAlias id={t} />}
        </Fragment>
      ))}
      <Separation />
    </>
  );

  const renderDetails = () => {
    return (
      <>
        <Separation />
        {hasMessages && renderMessages()}
        {hasChannels && renderInChannels()}
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
        <S.grid>
          <NodeTitle>
            {description ? description : 'Invoice'}
            {hasMessages && (
              <S.icon>
                <MessageCircle size={16} stroke={themeColors.blue2} />
              </S.icon>
            )}
          </NodeTitle>
          <DarkSubTitle>{`(${getDateDif(date)} ago)`}</DarkSubTitle>
          <Price amount={tokens} />
        </S.grid>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
