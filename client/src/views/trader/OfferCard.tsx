import React from 'react';
import {
    SubCard,
    Sub4Title,
    SubTitle,
    SingleLine,
    ResponsiveLine,
    Separation,
} from 'components/generic/Styled';
import { Rating } from 'components/rating/Rating';
import { TradesAmount, StyleArrow } from './OfferCard.styled';
import { DetailLine, MainInfo } from 'views/channels/Channels.style';
import { ChevronLeft, ChevronRight } from 'components/generic/Icons';
import { themeColors } from 'styles/Themes';

interface OfferCardProps {
    offer: any;
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
        version,
        asset_code,
        searchable,
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
        // id,
        // version,
        payment_method_id,
        payment_method_type,
        payment_method_name,
    } = payment_method_instructions || {};

    const {
        login,
        online_status,
        rating,
        trades_count,
        url,
        verified,
        verified_by,
        strong_hodler,
        // country,
        // country_code,
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

    const renderDetails = () => (
        <>
            <Separation />
            Hello
        </>
    );

    return (
        <SubCard key={`${index}-${id}`}>
            <MainInfo onClick={() => handleClick()}>
                {/* <SubTitle>{price}</SubTitle> */}
                <ResponsiveLine>
                    <SubTitle>
                        {/* {asset_code} */}
                        {side !== 'buy' ? asset_code : currency_code}
                        <StyleArrow color={themeColors.blue3} />
                        {side !== 'buy' ? currency_code : asset_code}
                        {/* {currency_code} */}
                    </SubTitle>
                    <SingleLine>
                        {`${login}`}
                        {trades_count && trades_count > 0 && (
                            <TradesAmount>{`(${trades_count}) `}</TradesAmount>
                        )}
                        <Rating rating={rating} />
                    </SingleLine>
                </ResponsiveLine>
                {title}
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
