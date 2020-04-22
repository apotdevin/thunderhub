import React, { useState } from 'react';
import {
  Headline,
  LeftHeadline,
  StyledImage,
  HomeTitle,
  HomeText,
  FullWidth,
  SlantedWrapper,
  SlantedEdge,
} from './HomePage.styled';
import { headerColor, inverseTextColor } from '../../styles/Themes';
import { Section } from '../../components/section/Section';
import { useTransition, animated, config } from 'react-spring';

export const TopSection = () => {
  const [state] = useState(true);

  const transition = useTransition(state, null, {
    config: config.slow,
    from: { transform: 'translate3d(-80px,0,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
  });

  const transition2 = useTransition(state, null, {
    config: config.slow,
    from: { transform: 'translate3d(80px,0,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
  });

  return (
    <>
      <Section color={headerColor} textColor={inverseTextColor}>
        <Headline>
          <LeftHeadline>
            {transition.map(({ props, key }) => (
              <animated.div style={props} key={key}>
                <HomeTitle>Control the Lightning</HomeTitle>
                <FullWidth>
                  <HomeText>
                    Monitor and manage your node from any browser and any
                    device.
                  </HomeText>
                </FullWidth>
              </animated.div>
            ))}
          </LeftHeadline>
          {transition2.map(({ props, key }) => (
            <animated.div style={props} key={key}>
              <StyledImage />
            </animated.div>
          ))}
        </Headline>
      </Section>
      <SlantedWrapper>
        <SlantedEdge />
      </SlantedWrapper>
    </>
  );
};
