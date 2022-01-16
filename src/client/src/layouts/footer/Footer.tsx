import React from 'react';
import getConfig from 'next/config';
import { Section } from '../../components/section/Section';
import { Link } from '../../components/link/Link';
import { Emoji } from '../../components/emoji/Emoji';
import { headerColor, fontColors } from '../../styles/Themes';
import {
  FooterWrapper,
  FooterStyle,
  SideFooter,
  Line,
  Title,
  Version,
  SideText,
  RightFooter,
  FooterRow,
  FooterCenterText,
} from './Footer.styled';
import { useRouter } from 'next/router';

const { publicRuntimeConfig } = getConfig();
const { npmVersion } = publicRuntimeConfig;

export const Footer = () => {
  const { pathname } = useRouter();

  return (
    <FooterWrapper>
      <Section
        padding="0 16px"
        fixedWidth={pathname === '/login'}
        color={headerColor}
      >
        <FooterStyle>
          <FooterRow>
            <SideFooter>
              <Line>
                <Title>ThunderHub</Title>
                <Version>{npmVersion}</Version>
              </Line>
              <SideText>Open-source Lightning Node Manager.</SideText>
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
          </FooterRow>
          <FooterCenterText>
            Made in Munich with <Emoji symbol={'🧡 '} label={'heart'} /> and{' '}
            <Emoji symbol={'⚡'} label={'lightning'} />.
          </FooterCenterText>
        </FooterStyle>
      </Section>
    </FooterWrapper>
  );
};
