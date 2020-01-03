import React from 'react';
import {
    SubCard,
    Separation,
    SingleLine,
    DarkSubTitle,
} from '../../components/generic/Styled';
import { renderLine } from '../../components/generic/Helpers';
import { MainInfo, NodeTitle, ColLine } from './Fees.style';

interface FeeCardProps {
    channelInfo: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

export const FeeCard = ({
    channelInfo,
    index,
    setIndexOpen,
    indexOpen,
}: FeeCardProps) => {
    const {
        alias,
        color,
        baseFee,
        feeRate,
        transactionId,
        transactionVout,
    } = channelInfo;

    const handleClick = () => {
        if (indexOpen === index) {
            setIndexOpen(0);
        } else {
            setIndexOpen(index);
        }
    };

    const renderDetails = () => {
        return (
            <>
                <Separation />
                {renderLine('Transaction Id:', transactionId)}
                {renderLine('Transaction Vout:', transactionVout)}
            </>
        );
    };

    return (
        <SubCard color={color} key={index}>
            <MainInfo onClick={() => handleClick()}>
                <SingleLine>
                    <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
                    <ColLine>
                        <SingleLine>
                            <DarkSubTitle>{`Base Fee:`}</DarkSubTitle>
                            <SingleLine>
                                {baseFee}
                                <DarkSubTitle>
                                    {baseFee === 1 ? 'sat' : 'sats'}
                                </DarkSubTitle>
                            </SingleLine>
                        </SingleLine>
                        <SingleLine>
                            <DarkSubTitle>{`Fee Rate:`}</DarkSubTitle>
                            <SingleLine>
                                {feeRate}
                                <DarkSubTitle>
                                    {feeRate === 1
                                        ? 'sat/million'
                                        : 'sats/million'}
                                </DarkSubTitle>
                            </SingleLine>
                        </SingleLine>
                    </ColLine>
                </SingleLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
