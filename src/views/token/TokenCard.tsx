import React, { FC } from 'react';
import {
  Card,
  CardWithTitle,
  DarkSubTitle,
} from 'src/components/generic/Styled';
import { useGetBaseInfoQuery } from 'src/graphql/queries/__generated__/getBaseInfo.generated';
import { LifeBuoy } from 'react-feather';
import styled from 'styled-components';
import {
  cardColor,
  chartColors,
  mediaWidths,
  themeColors,
} from 'src/styles/Themes';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { getPrice } from 'src/components/price/Price';
import { usePriceState } from 'src/context/PriceContext';
import { useConfigState } from 'src/context/ConfigContext';
import { BuyButton } from 'src/views/token/BuyButton';
import { RecoverToken } from './RecoverToken';

const S = {
  Row: styled.div`
    display: flex;
    position: relative;

    @media (${mediaWidths.mobile}) {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  `,
  Title: styled.h3`
    margin: 0 0 8px;

    @media (${mediaWidths.mobile}) {
      margin: 0 0 24px;
    }
  `,
  Text: styled.div`
    padding-left: 16px;
  `,
  IconWrapper: styled.div`
    width: 120px;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Strike: styled.div`
    text-decoration: line-through;
    font-size: 14px;
  `,
  Price: styled.div`
    font-weight: bolder;
    font-size: 18px;
  `,
  PriceBox: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    text-align: right;
    width: 100%;

    @media (${mediaWidths.mobile}) {
      margin: 24px 0 0;
      align-items: center;
    }
  `,
  Discount: styled.div`
    position: absolute;
    top: -36px;
    right: -16px;
    background: ${cardColor};
    border: 1px solid ${chartColors.green};
    color: ${chartColors.green};
    padding: 4px 8px;
    border-radius: 8px;
  `,
};

type TokenCardProps = {
  paidCallback: (id: string) => void;
};

export const TokenCard: FC<TokenCardProps> = ({ paidCallback }) => {
  const { data, loading, error } = useGetBaseInfoQuery();

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  if (loading) {
    return <LoadingCard noTitle={true} />;
  }

  if (error || !data?.getBaseInfo) {
    return (
      <Card>
        <DarkSubTitle>Unable to get token information</DarkSubTitle>
      </Card>
    );
  }

  const { apiTokenSatPrice, apiTokenOriginalSatPrice } = data.getBaseInfo;

  const monthPrice = apiTokenSatPrice * 30;
  const originalMonthPrice = apiTokenOriginalSatPrice * 30;

  const formatDayPrice = format({ amount: apiTokenSatPrice });
  const formatPrice = format({ amount: monthPrice });
  const formatOriginalPrice = format({ amount: originalMonthPrice });

  const percent = Math.round(
    ((originalMonthPrice - monthPrice) / originalMonthPrice) * 100
  );

  const hasDiscount = percent > 0;
  const discount = `-${percent}%`;

  return (
    <>
      <CardWithTitle>
        <S.Title>ThunderBase Token</S.Title>
        <Card>
          <S.Row>
            {hasDiscount && <S.Discount>{discount}</S.Discount>}
            <S.IconWrapper>
              <LifeBuoy size={64} color={themeColors.blue2} />
            </S.IconWrapper>
            <S.Text>
              This token gives you access to the full ThunderBase API.
              <DarkSubTitle>
                Features: Historical BOS score data, more to come...
              </DarkSubTitle>
            </S.Text>
            <S.PriceBox>
              {hasDiscount && (
                <S.Strike>{`${formatOriginalPrice}/month`}</S.Strike>
              )}
              <S.Price>{`${formatPrice}/month`}</S.Price>
              <DarkSubTitle>{`${formatDayPrice}/day`}</DarkSubTitle>
            </S.PriceBox>
          </S.Row>
          <BuyButton
            paidCallback={paidCallback}
          >{`Buy a 1 month token for ${formatPrice}`}</BuyButton>
        </Card>
      </CardWithTitle>
      <RecoverToken />
    </>
  );
};
