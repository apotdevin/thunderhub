import React from 'react';
import {
    Wrapper,
    Card,
    SubTitle,
    SingleLine,
    ColumnLine,
    Sub4Title,
} from '../../components/generic/Styled';
import {
    Headline,
    LeftHeadline,
    StyledImage,
    HomeButton,
} from './HomePage.styled';
import styled from 'styled-components';
import {
    Zap,
    Eye,
    Send,
    Key,
    Server,
    Sliders,
    Users,
} from '../../components/generic/Icons';
import { backgroundColor } from '../../styles/Themes';
import { Link } from 'react-router-dom';

const DetailCard = styled(Card)`
    width: 33%;
    background-color: ${backgroundColor};
    margin-bottom: 0;
    margin: 8px 16px;
`;

const DetailLine = styled.div`
    margin: 0 -16px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Padding = styled.div`
    padding-right: ${({ padding }: { padding?: string }) =>
        padding ? padding : '16px'};
`;

const detailCardContent = (title: string, text: string, Icon: any) => (
    <DetailCard>
        <SingleLine>
            <Padding>
                <Icon size={'40px'} strokeWidth={'1px'} />
            </Padding>
            <ColumnLine>
                <SubTitle>{title}</SubTitle>
                <Sub4Title>{text}</Sub4Title>
            </ColumnLine>
        </SingleLine>
    </DetailCard>
);

export const HomePageView = () => {
    return (
        <>
            <Wrapper>
                <Headline>
                    <LeftHeadline>
                        <h1>Control The Power of Lighting</h1>
                        <h4>
                            Take full control of your lightning node. Think of
                            something else to place here. Think Think Think
                        </h4>
                        <h5>Available everywhere you can open a website.</h5>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <HomeButton>
                                <Padding padding={'4px'}>
                                    <Zap />
                                </Padding>
                                Control The Lightning
                            </HomeButton>
                        </Link>
                    </LeftHeadline>
                    <StyledImage />
                </Headline>
            </Wrapper>
            <Wrapper withColor={true}>
                <DetailLine>
                    {detailCardContent(
                        'Make Payments',
                        'Send and receive both Lightning and On-Chain payments.',
                        Send,
                    )}
                    {detailCardContent(
                        'Multiple Nodes',
                        'Connect to multiple nodes and quickly switch between them.',
                        Server,
                    )}
                    {detailCardContent(
                        'View-Only Mode',
                        `Check the status of your node any time without risk.`,
                        Eye,
                    )}
                </DetailLine>
                <DetailLine>
                    {detailCardContent(
                        'AES Encryption',
                        'Your Macaroon is AES encrypted with a password only you know.',
                        Key,
                    )}
                    {detailCardContent(
                        'Open Source',
                        `Don't trust anyone. Verify the code yourself.`,
                        Users,
                    )}
                    {detailCardContent(
                        'Manage Channels',
                        'Open, close and monitor channel status and liquidity',
                        Sliders,
                    )}
                </DetailLine>
            </Wrapper>
            <Wrapper>
                <div>Another Line</div>
            </Wrapper>
        </>
    );
};
