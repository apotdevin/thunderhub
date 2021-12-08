import styled from 'styled-components';
import { fontColors, mediaWidths, headerColor } from '../../styles/Themes';

export const Headline = styled.div`
  padding: 16px 0;
  width: 100%;

  @media (${mediaWidths.mobile}) {
    padding: 0;
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
    font-size: 14px;
    margin: 0 32px;
  }
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
  ${({ changeColor }: { changeColor?: boolean | null }) =>
    changeColor && `color: ${fontColors.white};`}
  padding-bottom: 8px;
`;

export const LockPadding = styled.span`
  margin-left: 4px;
`;

export const ThunderStorm = styled.img`
  height: 320px;
  width: 100%;
  top: 0px;
  object-fit: cover;
  position: absolute;
  z-index: -1;
  background-color: ${headerColor};

  @media (${mediaWidths.mobile}) {
    font-size: 15px;
  }
`;
