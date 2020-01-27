import React from 'react';
import { Wrapper } from '../../../components/generic/Styled';
import {
    Headline,
    LeftHeadline,
    StyledImage,
    HomeButton,
} from './HomePage.styled';
import styled from 'styled-components';
import { Zap } from '../../../components/generic/Icons';
import { headerColor, inverseTextColor } from '../../../styles/Themes';
import { Link } from 'react-router-dom';
import { DetailSection } from './DetailSection';

const Padding = styled.div`
    padding: ${({ padding }: { padding?: string }) =>
        padding ? padding : '16px'};
`;

const SlantedWrapper = styled.div`
    width: 100%;
    height: 200px;
    margin-bottom: -260px;
    overflow: hidden;
    z-index: -5;
`;

const SlantedEdge = styled.div`
    content: '';
    width: 100%;
    height: 100%;
    background: ${headerColor};
    -webkit-transform-origin: 100% 0;
    -ms-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: skew(84deg);
    -ms-transform: skew(84deg);
    transform: skew(88deg);
    z-index: -5;
`;

export const HomePageView = () => {
    return (
        <>
            <Wrapper
                withColor={true}
                color={headerColor}
                textColor={inverseTextColor}
            >
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
                                <Padding padding={'4px 4px 0 0'}>
                                    <Zap fillcolor={'white'} />
                                </Padding>
                                Control The Lightning
                            </HomeButton>
                        </Link>
                    </LeftHeadline>
                    <StyledImage />
                </Headline>
            </Wrapper>
            <SlantedWrapper>
                <SlantedEdge />
            </SlantedWrapper>
            <DetailSection />
            <Wrapper>
                <div>Another Line</div>
            </Wrapper>
        </>
    );
};
