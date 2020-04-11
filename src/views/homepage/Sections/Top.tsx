import React from 'react';
import {
  Headline,
  LeftHeadline,
  StyledImage,
  HomeButton,
  Title,
  Text,
} from '../HomePage.styled';
import { Zap } from '../../../components/generic/Icons';
import { headerColor, inverseTextColor } from '../../../styles/Themes';
import { Section } from '../../../components/section/Section';
import {
  FullWidth,
  Padding,
  SlantedWrapper,
  SlantedEdge,
} from './Sections.styled';
import { Link } from '../../../components/link/Link';

export const TopSection = () => {
  return (
    <>
      <Section color={headerColor} textColor={inverseTextColor}>
        <Headline>
          <LeftHeadline>
            <Title>Control The Power of Lightning</Title>
            <FullWidth>
              <Text>
                Take full control of your lightning node for quick monitoring
                and management inside your browser.
              </Text>
            </FullWidth>
            <FullWidth>
              <Link to="/login" underline={'transparent'}>
                <HomeButton>
                  <Padding>
                    <Zap fillcolor={'white'} color={'white'} />
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
