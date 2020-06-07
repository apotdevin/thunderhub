import React from 'react';
import numeral from 'numeral';
import { HodlOfferType } from 'src/graphql/types';
import {
  SubCard,
  Sub4Title,
  SubTitle,
  SingleLine,
  ResponsiveLine,
  Separation,
} from '../../components/generic/Styled';
import { Rating } from '../../components/rating/Rating';
import { MainInfo } from '../../components/generic/CardGeneric';
import { themeColors } from '../../styles/Themes';
import { renderLine } from '../../components/generic/helpers';
import { Link } from '../../components/link/Link';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { MethodBoxes } from './MethodBoxes';
import {
  TradesAmount,
  StyleArrow,
  StyledTitle,
  StyledLogin,
  StyledDescription,
} from './OfferCard.styled';

const format = (value: number | string, format = '0,0.00') =>
  numeral(value).format(format);

interface OfferCardProps {
  offer: HodlOfferType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const OfferCard = ({
  offer,
  index,
  setIndexOpen,
  indexOpen,
}: OfferCardProps) => {
  const {
    id,
    asset_code,
    country,
    country_code,
    working_now,
    side,
    title,
    description,
    currency_code,
    price,
    min_amount,
    max_amount,
    first_trade_limit,
    fee,
    balance,
    payment_window_minutes,
    confirmations,
    payment_method_instructions,
    trader,
  } = offer;

  const { author_fee_rate } = fee;

  const {
    login,
    online_status,
    rating,
    trades_count = 0,
    url,
    verified,
    verified_by,
    strong_hodler,
    country: traderCountry,
    country_code: traderCode,
    average_payment_time_minutes,
    average_release_time_minutes,
    days_since_last_trade,
  } = trader;

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderPayments = (): string => {
    if (payment_method_instructions) {
      const methods = payment_method_instructions.map(
        (method: {
          payment_method_name: string;
          payment_method_type: string;
        }) => `${method.payment_method_name} (${method.payment_method_type})`
      );

      return methods.join(', ');
    }
    return '';
  };

  const renderDetails = () => (
    <>
      <Separation />
      <StyledDescription>{description}</StyledDescription>
      <Separation />
      {renderLine('Price', format(price))}
      {renderLine('Min Amount:', format(min_amount))}
      {renderLine('Max Amount:', format(max_amount))}
      {renderLine('First Trade Limit:', format(first_trade_limit))}
      {renderLine('Payment Options:', renderPayments())}
      {renderLine('Country:', `${country} (${country_code})`)}
      {renderLine('Available Now:', working_now ? 'Yes' : 'No')}
      {renderLine('Balance:', format(balance))}
      {renderLine('Payment Window (min):', payment_window_minutes)}
      {renderLine('Confirmations:', confirmations)}
      {renderLine('Fee Rate:', `${format(Number(author_fee_rate) * 100)}%`)}
      <Separation />
      <Sub4Title>Trader</Sub4Title>
      {renderLine('User:', login)}
      {renderLine('Online:', online_status)}
      {renderLine('Rating:', rating)}
      {renderLine('Amount of Trades:', trades_count)}
      {renderLine('Verified:', verified ? 'True' : 'False')}
      {renderLine('Verified By:', verified_by)}
      {renderLine('Strong Hodler:', strong_hodler ? 'True' : 'False')}
      {renderLine('Country:', `${traderCountry} (${traderCode})`)}
      {renderLine('Average Payment Time (min):', average_payment_time_minutes)}
      {renderLine('Average Release Time (min):', average_release_time_minutes)}
      {renderLine('Days since last trade:', days_since_last_trade)}
      <SingleLine>
        <Link
          href={`https://hodlhodl.com/offers/${id}`}
          underline={'transparent'}
          fullWidth={true}
        >
          <ColorButton
            withBorder={true}
            withMargin={'16px 8px 0 0'}
            fullWidth={true}
          >
            View Offer
          </ColorButton>
        </Link>
        <Link href={url} underline={'transparent'} fullWidth={true}>
          <ColorButton
            withBorder={true}
            withMargin={'16px 0 0 8px'}
            fullWidth={true}
          >
            View trader
          </ColorButton>
        </Link>
      </SingleLine>
    </>
  );

  return (
    <SubCard withMargin={'16px 0 24px'} key={`${index}-${id}`}>
      <MainInfo onClick={() => handleClick()}>
        <MethodBoxes methods={payment_method_instructions} />
        <ResponsiveLine>
          <SubTitle>
            {side !== 'buy' ? asset_code : currency_code}
            <StyleArrow size={18} color={themeColors.blue3} />
            {side !== 'buy' ? currency_code : asset_code}
          </SubTitle>
          <SingleLine>
            <StyledLogin>{login}</StyledLogin>
            {trades_count > 0 && (
              <TradesAmount>{`(${trades_count}) `}</TradesAmount>
            )}
            <Rating rating={Number(rating)} />
          </SingleLine>
        </ResponsiveLine>
        <StyledTitle>{title}</StyledTitle>
        {renderLine('Price:', format(price))}
        {renderLine(
          'Min/Max amount:',
          `${format(min_amount, '0a')}/${format(max_amount, '0a')}`
        )}
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
