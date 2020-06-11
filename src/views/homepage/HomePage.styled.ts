import styled, { keyframes } from 'styled-components';
import { fontColors, mediaWidths } from '../../styles/Themes';
import ThunderHub from '../../assets/ThunderHub.svg';

export const Headline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0 100px;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
    padding: 0 0 60px;
    width: 100%;
  }
`;

export const LeftHeadline = styled.div`
  width: 35%;
  display: flex;
  flex-direction: column;

  @media (${mediaWidths.mobile}) {
    width: 100%;
    text-align: center;
    margin-bottom: 0;
  }
`;

const flicker = keyframes`
    0%    { opacity: 1;   }
    3%    { opacity: 0.4; }
    6%    { opacity: 1;   }
    7%    { opacity: 0.4; }
    8%    { opacity: 1;   }
    9%    { opacity: 0.4; }
    10%   { opacity: 0;   }
    100%  { opacity: 0;   }
`;

export const StyledImage = styled(ThunderHub)`
  width: 360px;

  & .glowEffect {
    animation: ${flicker} 3s infinite step-end;
  }
  & .glowEffectTwo {
    animation: ${flicker} 5s infinite step-end;
  }
  & .glowEffectThree {
    animation: ${flicker} 7s infinite step-end;
  }
  & .glowEffectFour {
    animation: ${flicker} 3.5s infinite step-end;
  }

  @media (${mediaWidths.mobile}) {
    width: 100%;
  }
`;

export const HomeTitle = styled.h1`
  width: 100%;
  text-align: center;
  color: ${({ textColor }: { textColor?: string }) =>
    textColor ? textColor : fontColors.white};
  font-size: 56px;
  margin: 0;
  font-weight: 900;

  @media (${mediaWidths.mobile}) {
    font-size: 24px;
  }
`;

export const HomeText = styled.p`
  color: ${fontColors.white};
  text-align: center;
  font-size: 20px;

  @media (${mediaWidths.mobile}) {
    font-size: 15px;
  }
`;

export const StyledSection = styled.div`
  margin-bottom: -60px;
`;

export const FullWidth = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
`;

export const ConnectTitle = styled.div`
  width: 100%;
  font-size: 18px;
  ${({ change }: { change?: boolean }) =>
    change && `color: ${fontColors.white};`}
  padding-bottom: 8px;
`;

export const LockPadding = styled.span`
  margin-left: 4px;
`;
