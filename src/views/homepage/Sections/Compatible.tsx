import React, { useState, useEffect } from 'react';
import { Center } from '../../../components/typography/Styled';
import { Section } from '../../../components/section/Section';
import {
  VersionColumn,
  StyledH2,
  StyledP,
  StyledLND,
  Row,
  ClippedSection,
} from './Sections.styled';
import { homeCompatibleColor, inverseTextColor } from '../../../styles/Themes';
import { useTransition, animated } from 'react-spring';
import image from '../../../assets/LND.png';
import { useInView } from 'react-intersection-observer';
import 'intersection-observer'; // Polyfill
import { ViewSwitch } from '../../../components/viewSwitch/ViewSwitch';

export const Compatible = () => {
  const [items, setItems] = useState([]);

  const [ref, inView] = useInView({
    threshold: 0.6,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      setItems([
        { title: 'v0.9.1-beta', id: 0 },
        { title: 'v0.9.0-beta', id: 1 },
        { title: 'v0.8.2-beta', id: 2 },
        { title: 'v0.8.1-beta', id: 3 },
        { title: 'v0.8.0-beta', id: 4 },
        { title: 'v0.7.1-beta', id: 5 },
      ]);
    }
  }, [inView]);

  const transition = useTransition(items, item => item.id, {
    trail: 1000,
    from: {
      transform: inView ? 'translate3d(80px,0,0)' : 'translate3d(0,0,0)',
      opacity: 0,
    },
    enter: { transform: 'translate3d(0,0,0)', opacity: inView ? 1 : 0 },
    leave: { opacity: 0 },
    config: { tension: 220, friction: 120 },
  });

  return (
    <ClippedSection>
      <Section
        textColor={inverseTextColor}
        color={homeCompatibleColor}
        padding={'40px 0'}
      >
        <div style={{ width: '100%' }}>
          <Center>
            <StyledH2>Compatible with the latest LND node versions.</StyledH2>
          </Center>
          <Row ref={ref}>
            <VersionColumn>
              <StyledLND src={image} />
            </VersionColumn>
            <VersionColumn>
              {inView &&
                transition.map(({ item, props, key }) => (
                  <animated.div key={key} style={{ ...props }}>
                    <StyledP key={key} style={{ ...props }}>
                      {item.title}
                    </StyledP>
                  </animated.div>
                ))}
            </VersionColumn>
          </Row>
        </div>
      </Section>
    </ClippedSection>
  );
};
