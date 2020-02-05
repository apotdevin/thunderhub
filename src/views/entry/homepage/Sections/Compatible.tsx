import React from 'react';
import { Center } from 'views/other/OtherViews.styled';
import { Section } from 'components/section/Section';
import { WrapSingleLine, StyledH2, StyledP } from './Sections.styled';
import { themeColors } from 'styles/Themes';

export const Compatible = () => {
    return (
        <Section color={themeColors.grey2} padding={'40px 0'}>
            <Center>
                <StyledH2>
                    Compatible with the latest LND node versions.
                </StyledH2>
            </Center>
            <WrapSingleLine>
                <StyledP>v0.7.1-beta</StyledP>
                <StyledP>v0.8.0-beta</StyledP>
                <StyledP>v0.8.1-beta</StyledP>
                <StyledP>v0.8.2-beta</StyledP>
                <StyledP>v0.9.0-beta</StyledP>
            </WrapSingleLine>
        </Section>
    );
};
