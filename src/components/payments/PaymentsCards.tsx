import React, { useContext } from 'react';
import { getValue } from '../../helpers/Helpers';
import { SettingsContext } from '../../context/SettingsContext';
import { Separation, SubCard } from '../generic/Styled';
import {
    DetailLine,
    StatusLine,
    NodeBar,
    NodeTitle,
    NodeDetails,
    MainInfo,
} from '../channels/Channels.style';
import {
    getStatusDot,
    getDateDif,
    getFormatDate,
    getNodeLink,
} from '../generic/Helpers';

interface PaymentsCardProps {
    payment: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

export const PaymentsCard = ({
    payment,
    index,
    setIndexOpen,
    indexOpen,
}: PaymentsCardProps) => {
    const { price, symbol, currency } = useContext(SettingsContext);
    const priceProps = { price, symbol, currency };

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const {
        createdAt,
        destination,
        fee,
        feeMtokens,
        hops,
        isConfirmed,
        tokens,
        // id,
        // isOutgoing,
        // mtokens,
        // request,
        // secret,
    } = payment;

    const formatAmount = getFormat(tokens);

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
                <DetailLine>
                    <div>Created:</div>
                    {`${getDateDif(createdAt)} ago (${getFormatDate(
                        createdAt,
                    )})`}
                </DetailLine>
                <DetailLine>
                    <div>Destination Node:</div>
                    {getNodeLink(destination)}
                </DetailLine>
                <DetailLine>
                    <div>Fee:</div>
                    {getFormat(fee)}
                </DetailLine>
                <DetailLine>
                    <div>Fee msats:</div>
                    {`${feeMtokens} sats`}
                </DetailLine>
                <DetailLine data-tip data-for={`payment_hops_${index}`}>
                    <div>Hops:</div>
                    {hops.length}
                </DetailLine>
                {hops.map((hop: any, index: number) => (
                    <DetailLine>
                        <div>{`Hop ${index + 1}:`}</div>
                        <div style={{ textAlign: 'right' }} key={index}>
                            {hop}
                        </div>
                    </DetailLine>
                ))}
                {/* <DetailLine>{id}</DetailLine> */}
                {/* <DetailLine>{isOutgoing ? 'true': 'false'}</DetailLine> */}
                {/* <DetailLine>{secret}</DetailLine> */}
                {/* <DetailLine>{request}</DetailLine> */}
            </>
        );
    };

    return (
        <SubCard key={index}>
            <MainInfo onClick={() => handleClick()}>
                <StatusLine>{getStatusDot(isConfirmed, 'active')}</StatusLine>
                <NodeBar>
                    <NodeTitle>
                        {formatAmount}
                        {/* <DifLine>
						{formatDifference(formatDif, dif, isConfirmed)}
					</DifLine> */}
                    </NodeTitle>
                    <NodeDetails>
                        {/* {description} */}
                        {/* {formatBalance} */}
                        {/* <div>
						<Progress
							data-tip
							data-for={`node_balance_tip_${index}`}
						>
							<ProgressBar
								percent={getPercent(
									localBalance,
									remoteBalance
								)}
							/>
						</Progress>
						<Progress
							data-tip
							data-for={`node_activity_tip_${index}`}
						>
							<ProgressBar
								order={2}
								percent={getPercent(received, sent)}
							/>
						</Progress>
					</div> */}
                    </NodeDetails>
                </NodeBar>
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
