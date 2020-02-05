import React from 'react';
import { Center } from 'views/other/OtherViews.styled';
import { Section } from 'components/section/Section';
import { Padding, StyledH2, StyledH1 } from './Sections.styled';
import { themeColors } from 'styles/Themes';
import { Link } from 'react-router-dom';
import { HomeButton } from '../HomePage.styled';
import { Zap } from 'components/generic/Icons';
import styled from 'styled-components';

const CallToActionButton = styled(HomeButton)`
    margin: 16px 0 0;
`;

export const CallToAction = () => {
    return (
        <>
            <Section color={themeColors.grey} padding={'80px 0'}>
                <Center>
                    <StyledH1>And much more...</StyledH1>
                </Center>
            </Section>
            <Section color={themeColors.grey2} padding={'80px 0'}>
                <Center>
                    <StyledH2>
                        Ready to take control of your Lightning Node?
                    </StyledH2>
                </Center>
                <Center>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <CallToActionButton>
                            <Padding>
                                <Zap fillcolor={'white'} color={'white'} />
                            </Padding>
                            Control The Lightning
                        </CallToActionButton>
                    </Link>
                </Center>
            </Section>
        </>
    );
};
