import React from 'react';
import { Center } from 'views/other/OtherViews.styled';
import { Section } from 'components/section/Section';
import { WrapSingleLine } from './Sections.styled';
import { themeColors } from 'styles/Themes';

export const Compatible = () => {
    return (
        <Section color={themeColors.grey2} padding={'40px 0'}>
            <Center>
                <h2>Compatible with the latest LND node versions.</h2>
            </Center>
            <WrapSingleLine>
                <p>v0.7.1-beta</p>
                <p>v0.8.0-beta</p>
                <p>v0.8.1-beta</p>
                <p>v0.8.2-beta</p>
                <p>v0.9.0-beta</p>
            </WrapSingleLine>
        </Section>
    );
};
