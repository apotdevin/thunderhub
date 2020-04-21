import styled, { keyframes } from 'styled-components';
import { fontColors, mediaWidths } from '../../styles/Themes';
import ThunderHub from '../../assets/ThunderHub.svg';

export const Headline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 0 140px;

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

export const HomeButton = styled.button`
  cursor: pointer;
  outline: none;
  padding: 8px 24px;
  text-decoration: 2px solid blue;
  font-size: 16px;
  background-image: linear-gradient(to right, #fd5f00, #f99325);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  white-space: nowrap;
  width: 100%;
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
