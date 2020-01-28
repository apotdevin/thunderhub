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
    padding: 4px 4px 0 0;
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

const FullWidth = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 18px;
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
                        <p>
                            Take full control of your lightning node. Think of
                            something else to place here. Think Think Think
                        </p>
                        <FullWidth>
                            <Link
                                to="/login"
                                style={{ textDecoration: 'none' }}
                            >
                                <HomeButton>
                                    <Padding>
                                        <Zap
                                            fillcolor={'white'}
                                            color={'white'}
                                        />
                                    </Padding>
                                    Control The Lightning
                                </HomeButton>
                            </Link>
                        </FullWidth>
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
