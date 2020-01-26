import React, { useState, ReactNode } from 'react';
import {
    Card,
    CardWithTitle,
    SubTitle,
    SingleLine,
    Separation,
    DarkSubTitle,
    ColorButton,
} from '../../../components/generic/Styled';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { useQuery } from '@apollo/react-hooks';
import { GET_BALANCES } from '../../../graphql/query';
import { useSettings } from '../../../context/SettingsContext';
import styled from 'styled-components';
import {
    Send,
    Zap,
    Anchor,
    Pocket,
    DownArrow,
    XSvg,
} from '../../../components/generic/Icons';
import { getValue } from '../../../helpers/Helpers';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { PayCard } from './pay/pay';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { SendOnChainCard } from './sendOnChain/SendOnChain';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { useSize } from '../../../hooks/UseSize';

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

const Responsive = styled(SingleLine)`
    @media (max-width: 578px) {
        flex-direction: column;
    }
`;

const sectionColor = '#FFD300';

interface WrapperProps {
    width?: number;
    children: ReactNode;
}

const ResponsiveWrapper = ({ children, width = 0 }: WrapperProps) => {
    if (width <= 578) {
        return <Responsive>{children}</Responsive>;
    }
    return <>{children}</>;
};

export const AccountInfo = () => {
    const { width } = useSize();
    const [state, setState] = useState<string>('none');
    const { host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

    const { data, loading } = useQuery(GET_BALANCES, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    const { price, symbol, currency } = useSettings();
    const priceProps = { price, symbol, currency };

    if (!data || loading) {
        return (
            <>
                <LoadingCard title={'Resume'} />
                <LoadingCard title={'Your Accounts'} />
            </>
        );
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

    const renderContent = () => {
        switch (state) {
            case 'send_ln':
                return <PayCard color={sectionColor} />;
            case 'receive_ln':
                return <CreateInvoiceCard color={sectionColor} />;
            case 'send_chain':
                return <SendOnChainCard />;
            case 'receive_chain':
                return <ReceiveOnChainCard />;
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (state) {
            case 'send_ln':
                return 'Send Sats over Lightning';
            case 'receive_ln':
                return 'Receive Sats over Lightning';
            case 'send_chain':
                return 'Send To On Chain Address';
            case 'receive_chain':
                return 'Create Address to Receive';
            default:
                return 'Your Accounts';
        }
    };

    const showLn =
        state === 'send_ln' || state === 'receive_ln' || state === 'none';
    const showChain =
        state === 'send_chain' || state === 'receive_chain' || state === 'none';

    const renderLnAccount = () => (
        <SingleLine>
            <ResponsiveWrapper width={width}>
                <Zap color={pendingBalance === 0 ? sectionColor : '#652EC7'} />
                <Tile startTile={true}>
                    <DarkSubTitle>Account</DarkSubTitle>
                    <div>Lightning</div>
                </Tile>
            </ResponsiveWrapper>
            <ResponsiveWrapper width={width}>
                <Tile>
                    <DarkSubTitle>Current Balance</DarkSubTitle>
                    <div>{formatCCB}</div>
                </Tile>
                <Tile>
                    <DarkSubTitle>Pending Balance</DarkSubTitle>
                    <div>{formatPCB}</div>
                </Tile>
            </ResponsiveWrapper>
            <AdminSwitch>
                <ButtonRow>
                    {showLn && showChain && (
                        <ResponsiveWrapper width={width}>
                            <ColorButton
                                color={sectionColor}
                                onClick={() => setState('send_ln')}
                            >
                                <Send />
                            </ColorButton>
                            <ColorButton
                                color={sectionColor}
                                onClick={() => setState('receive_ln')}
                            >
                                <DownArrow />
                            </ColorButton>
                        </ResponsiveWrapper>
                    )}
                    {showLn && !showChain && (
                        <ColorButton
                            color={sectionColor}
                            onClick={() => setState('none')}
                        >
                            <XSvg />
                        </ColorButton>
                    )}
                </ButtonRow>
            </AdminSwitch>
        </SingleLine>
    );

    const renderChainAccount = () => (
        <SingleLine>
            <ResponsiveWrapper width={width}>
                <Anchor
                    color={pendingChainBalance === 0 ? sectionColor : '#652EC7'}
                />
                <Tile startTile={true}>
                    <DarkSubTitle>Account</DarkSubTitle>
                    <div>Bitcoin</div>
                </Tile>
            </ResponsiveWrapper>
            <ResponsiveWrapper width={width}>
                <Tile>
                    <DarkSubTitle>Current Balance</DarkSubTitle>
                    <div>{formatCB}</div>
                </Tile>
                <Tile>
                    <DarkSubTitle>Pending Balance</DarkSubTitle>
                    <div>{formatPB}</div>
                </Tile>
            </ResponsiveWrapper>
            <AdminSwitch>
                <ButtonRow>
                    {showLn && showChain && (
                        <ResponsiveWrapper width={width}>
                            <ColorButton
                                color={sectionColor}
                                onClick={() => setState('send_chain')}
                            >
                                <Send />
                            </ColorButton>
                            <ColorButton
                                color={sectionColor}
                                onClick={() => setState('receive_chain')}
                            >
                                <DownArrow />
                            </ColorButton>
                        </ResponsiveWrapper>
                    )}
                    {!showLn && showChain && (
                        <ColorButton
                            color={sectionColor}
                            onClick={() => setState('none')}
                        >
                            <XSvg />
                        </ColorButton>
                    )}
                </ButtonRow>
            </AdminSwitch>
        </SingleLine>
    );

    return (
        <>
            <CardWithTitle>
                <SubTitle>Resume</SubTitle>
                <Card>
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
                        <ResponsiveWrapper width={width}>
                            <Tile>
                                <DarkSubTitle>Current Balance</DarkSubTitle>
                                <div>{totalB}</div>
                            </Tile>
                            <Tile>
                                <DarkSubTitle>Pending Balance</DarkSubTitle>
                                <div>{totalPB}</div>
                            </Tile>
                        </ResponsiveWrapper>
                    </SingleLine>
                </Card>
            </CardWithTitle>
            <CardWithTitle>
                <SubTitle>{getTitle()}</SubTitle>
                <Card>
                    {showLn && renderLnAccount()}
                    {showLn && <Separation />}
                    {showChain && renderChainAccount()}
                    {!showLn && showChain && <Separation />}
                    {renderContent()}
                </Card>
            </CardWithTitle>
        </>
    );
};
