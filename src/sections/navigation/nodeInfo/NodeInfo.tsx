import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_NODE_INFO } from '../../../graphql/query';
import { useSettings } from '../../../context/SettingsContext';
import { getValue } from '../../../helpers/Helpers';
import { Separation } from '../../../components/generic/Styled';
import { QuestionIcon, Zap, Anchor } from '../../../components/generic/Icons';
import { getTooltipType } from '../../../components/generic/Helpers';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { textColorMap } from '../../../styles/Themes';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import ScaleLoader from 'react-spinners/ScaleLoader';

const Title = styled.div`
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Info = styled.div`
    font-size: 14px;
    color: #bfbfbf;
    border-bottom: 2px solid
        ${({ bottomColor }: { bottomColor: string }) => bottomColor};
`;

const Balance = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0;
    padding: 0 5px;
    cursor: default;
`;

const Alias = styled.div`
    border-bottom: 2px solid
        ${({ bottomColor }: { bottomColor: string }) => bottomColor};
`;

export const NodeInfo = () => {
    const { host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

    const { loading, data } = useQuery(GET_NODE_INFO, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    const { price, symbol, currency, theme } = useSettings();
    const priceProps = { price, symbol, currency };

    const tooltipType = getTooltipType(theme);

    if (loading || !data || !data.getNodeInfo) {
        return (
            <ScaleLoader height={10} width={2} color={textColorMap[theme]} />
        );
    }

    const {
        chains,
        color,
        active_channels_count,
        closed_channels_count,
        alias,
        is_synced_to_chain,
        peers_count,
        pending_channels_count,
        version,
    } = data.getNodeInfo;

    console.log('NodeInfo chains:', chains);

    const chainBalance = data.getChainBalance;
    const pendingChainBalance = data.getPendingChainBalance;
    const { confirmedBalance, pendingBalance } = data.getChannelBalance;

    const getFormat = (amount: number) => getValue({ amount, ...priceProps });

    const formatCB = getFormat(chainBalance);
    const formatPB = getFormat(pendingChainBalance);
    const formatCCB = getFormat(confirmedBalance);
    const formatPCB = getFormat(pendingBalance);

    return (
        <>
            <Title>
                <Alias bottomColor={color}>{alias}</Alias>
                <QuestionIcon data-tip={`Version: ${version}`} />
            </Title>
            <Separation />
            <Balance data-tip data-for="balance_tip">
                <Zap color={pendingBalance === 0 ? '#FFD300' : '#652EC7'} />
                {formatCCB}
            </Balance>
            <Balance data-tip data-for="chain_balance_tip">
                <Anchor
                    color={pendingChainBalance === 0 ? '#FFD300' : '#652EC7'}
                />
                {formatCB}
            </Balance>
            <Balance
                data-tip
                data-for="node_tip"
            >{`${active_channels_count} / ${pending_channels_count} / ${closed_channels_count} / ${peers_count}`}</Balance>
            <Balance>
                <Info bottomColor={is_synced_to_chain ? '#95de64' : '#ff7875'}>
                    {is_synced_to_chain ? 'Synced' : 'Not Synced'}
                </Info>
            </Balance>
            <Separation />
            <ReactTooltip effect={'solid'} place={'right'} type={tooltipType} />
            <ReactTooltip
                id={'balance_tip'}
                effect={'solid'}
                place={'right'}
                type={tooltipType}
            >
                <div>{`Channel Balance: ${formatCCB}`}</div>
                <div>{`Pending Channel Balance: ${formatPCB}`}</div>
            </ReactTooltip>
            <ReactTooltip
                id={'chain_balance_tip'}
                effect={'solid'}
                place={'right'}
                type={tooltipType}
            >
                <div>{`Chain Balance: ${formatCB}`}</div>
                <div>{`Pending Chain Balance: ${formatPB}`}</div>
            </ReactTooltip>
            <ReactTooltip
                id={'node_tip'}
                effect={'solid'}
                place={'right'}
                type={tooltipType}
            >
                <div>{`Active Channels: ${active_channels_count}`}</div>
                <div>{`Pending Channels: ${pending_channels_count}`}</div>
                <div>{`Closed Channels: ${closed_channels_count}`}</div>
                <div>{`Peers: ${peers_count}`}</div>
            </ReactTooltip>
        </>
    );
};
