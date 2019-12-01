import React, { useContext } from 'react';
import {
    Card,
    CardWithTitle,
    SubTitle,
    SingleLine,
    Separation,
    SimpleButton,
    DarkSubTitle,
} from '../generic/Styled';
import { AccountContext } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { useQuery } from '@apollo/react-hooks';
import { GET_BALANCES } from '../../graphql/query';
import { SettingsContext } from '../../context/SettingsContext';
import styled from 'styled-components';
import {
    Send,
    MoreVertical,
    Zap,
    Anchor,
    Pocket,
    DownArrow,
} from '../generic/Icons';
import { unSelectedNavButton } from '../../styles/Themes';
import { getValue } from '../../helpers/Helpers';

const Tile = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: ${({ startTile }: { startTile?: boolean }) =>
        startTile ? 'flex-start' : 'flex-end'};
`;

const ButtonRow = styled.div`
    display: flex;
`;

export const AccountInfo = () => {
    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { loading, error, data } = useQuery(GET_BALANCES, {
        variables: { auth },
    });

    const { price, symbol, currency, theme } = useContext(SettingsContext);
    const priceProps = { price, symbol, currency };

    if (!data) {
        return <div>Loading</div>;
    }

    const chainBalance = data.getChainBalance;
    const pendingChainBalance = data.getPendingChainBalance;
    const { confirmedBalance, pendingBalance } = data.getChannelBalance;

    const getFormat = (amount: number) => getValue({ amount, ...priceProps });

    const formatCB = getFormat(chainBalance);
    const formatPB = getFormat(pendingChainBalance);
    const formatCCB = getFormat(confirmedBalance);
    const formatPCB = getFormat(pendingBalance);

    const totalB = getFormat(chainBalance + confirmedBalance);
    const totalPB = getFormat(pendingChainBalance + pendingBalance);

    return (
        <>
            <CardWithTitle>
                <SubTitle>Resume</SubTitle>
                <Card bottom={'20px'}>
                    <SingleLine>
                        <Pocket
                            color={
                                pendingChainBalance === 0 &&
                                pendingBalance === 0
                                    ? '#2bbc54'
                                    : '#652EC7'
                            }
                        />
                        <Tile startTile={true}>
                            <DarkSubTitle>Account</DarkSubTitle>
                            <div>Total</div>
                        </Tile>
                        <Tile>
                            <DarkSubTitle>Current Balance</DarkSubTitle>
                            <div>{totalB}</div>
                        </Tile>
                        <Tile>
                            <DarkSubTitle>Pending Balance</DarkSubTitle>
                            <div>{totalPB}</div>
                        </Tile>
                    </SingleLine>
                </Card>
            </CardWithTitle>
            <CardWithTitle>
                <SubTitle>Your accounts</SubTitle>
                <Card bottom={'20px'}>
                    <SingleLine>
                        <Zap
                            color={pendingBalance === 0 ? '#FFD300' : '#652EC7'}
                        />
                        <Tile startTile={true}>
                            <DarkSubTitle>Account</DarkSubTitle>
                            <div>Lightning</div>
                        </Tile>
                        <Tile>
                            <DarkSubTitle>Current Balance</DarkSubTitle>
                            <div>{formatCCB}</div>
                        </Tile>
                        <Tile>
                            <DarkSubTitle>Pending Balance</DarkSubTitle>
                            <div>{formatPCB}</div>
                        </Tile>
                        <ButtonRow>
                            <SimpleButton>
                                <Send />
                            </SimpleButton>
                            <SimpleButton>
                                <DownArrow />
                            </SimpleButton>
                            <SimpleButton>
                                <MoreVertical />
                            </SimpleButton>
                        </ButtonRow>
                    </SingleLine>
                    <Separation />
                    <SingleLine>
                        <Anchor
                            color={
                                pendingChainBalance === 0
                                    ? '#FFD300'
                                    : '#652EC7'
                            }
                        />
                        <Tile startTile={true}>
                            <DarkSubTitle>Account</DarkSubTitle>
                            <div>Wallet</div>
                        </Tile>
                        <Tile>
                            <DarkSubTitle>Current Balance</DarkSubTitle>
                            <div>{formatCB}</div>
                        </Tile>
                        <Tile>
                            <DarkSubTitle>Pending Balance</DarkSubTitle>
                            <div>{formatPB}</div>
                        </Tile>
                        <ButtonRow>
                            <SimpleButton>
                                <Send />
                            </SimpleButton>
                            <SimpleButton>
                                <DownArrow />
                            </SimpleButton>
                            <SimpleButton>
                                <MoreVertical />
                            </SimpleButton>
                        </ButtonRow>
                    </SingleLine>
                </Card>
            </CardWithTitle>
        </>
    );
};
