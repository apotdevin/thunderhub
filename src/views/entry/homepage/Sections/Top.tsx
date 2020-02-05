import React from 'react';
import {
    Headline,
    LeftHeadline,
    StyledImage,
    HomeButton,
    Title,
    Text,
} from '../HomePage.styled';
import { Zap } from '../../../../components/generic/Icons';
import { headerColor, inverseTextColor } from '../../../../styles/Themes';
import { Link } from 'react-router-dom';
import { Section } from 'components/section/Section';
import {
    FullWidth,
    Padding,
    SlantedWrapper,
    SlantedEdge,
} from './Sections.styled';

export const TopSection = () => {
    return (
        <>
            <Section color={headerColor} textColor={inverseTextColor}>
                <Headline>
                    <LeftHeadline>
                        <Title>Control The Power of Lighting</Title>
                        <FullWidth>
                            <Text>
                                Take full control of your lightning node for
                                quick monitoring and management inside your
                                browser.
                            </Text>
                        </FullWidth>
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
            </Section>
            <SlantedWrapper>
                <SlantedEdge />
            </SlantedWrapper>
        </>
    );
};
