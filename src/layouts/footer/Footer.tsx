import React from 'react';
import { Section } from '../../components/section/Section';
import { Link } from '../../components/link/Link';
import { Emoji } from '../../components/emoji/Emoji';
import getConfig from 'next/config';
import { headerColor, fontColors } from '../../styles/Themes';
import {
  FooterWrapper,
  FooterStyle,
  SideFooter,
  Line,
  Title,
  Version,
  SideText,
  CopyrightText,
  RightFooter,
} from './Footer.styled';

const { publicRuntimeConfig } = getConfig();
const { npmVersion } = publicRuntimeConfig;

export const Footer = () => {
  return (
    <FooterWrapper>
      <Section withColor={true} color={headerColor}>
        <FooterStyle>
          <SideFooter>
            <Line>
              <Link to={'/'}>
                <Title>ThunderHub</Title>
              </Link>
              <Version>{npmVersion}</Version>
            </Line>
            <SideText>
              Open-source lightning node manager to control and monitor your LND
              node.
            </SideText>
            <SideText>
              Made in Munich with <Emoji symbol={'🧡'} label={'heart'} /> and{' '}
              <Emoji symbol={'⚡'} label={'lightning'} />.
            </SideText>
            <CopyrightText>
              Copyright © 2020. All rights reserved. ThunderHub
            </CopyrightText>
          </SideFooter>
          <RightFooter>
            <Link
              href={'https://github.com/apotdevin/thunderhub'}
              color={fontColors.blue}
            >
              Github
            </Link>
            <Link
              href={'https://twitter.com/thunderhubio'}
              color={fontColors.blue}
            >
              Twitter
            </Link>
          </RightFooter>
        </FooterStyle>
      </Section>
    </FooterWrapper>
  );
};
